/**
 * Generates random class name.
 * @param prefix class name prefix.
 * @returns random class name.
 */
export const generateClass = (prefix = 'st-'): string => prefix + Math.random().toString(36).slice(2)

/**
 * Converts a React-style JS object to standard CSS string.
 * @param styles - React inline style object.
 * @param selector - optional CSS selector to wrap the rules.
 * @returns CSS string.
 */
export function reactStylesToCss(
  styles: Record<string, string | number>,
  selector?: string
): string {
  const cssLines = Object.entries(styles)
    .filter(([_, value]) => typeof value !== 'undefined')
    .map(([key, value]) => {
      const kebabKey = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
      return `${kebabKey}: ${value};`
    })

  const cssBody = cssLines.join('\n')

  return selector ? `${selector} {\n${cssBody}\n}` : cssBody
}

type CSSRule = {
  selectors: string[];
  declarations: string;
  media: string | null;
};

const IMPLICIT_ROOT = ':root'

function stripComments(value: string): string {
  return value.replace(/\/\*[\s\S]*?\*\//g, '').trim()
}

function buildDeclarations(text: string): string {
  const lines = text.split(/;\s*/).map(l => l.trim())
  let result = lines.filter(l => l.includes(':')).join(';\n')
  if (result.length > 1 && !result.endsWith(';')) {
    result += ';\n'
  }
  return result
}

function findNonStringChar(text: string, target: string, start = 0): number {
  let inString: string | null = null
  for (let i = start; i < text.length; i++) {
    const c = text[i]
    if (inString) {
      if (c === inString && text[i - 1] !== '\\') inString = null
      continue
    }
    if (c === '"' || c === '\'') {
      inString = c
      continue
    }
    if (c === target) return i
  }
  return -1
}

function findMatchingBrace(text: string, openIndex: number): number {
  let depth = 1
  let i = openIndex + 1
  let inString: string | null = null

  while (depth > 0 && i < text.length) {
    const c = text[i]
    if (inString) {
      if (c === inString && text[i - 1] !== '\\') inString = null
    } else {
      if (c === '"' || c === '\'') {
        inString = c
      } else if (c === '{') {
        depth++
      } else if (c === '}') depth--
    }
    i++
  }

  return i
}

function splitDeclarationsAndNestedBlocks(content: string): { declarationText: string; nestedBlocks: string[] } {
  const nestedBlocks: string[] = []
  let declarationText = ''
  let i = 0
  const n = content.length

  while (i < n) {
    while (i < n && /\s/.test(content[i])) {
      declarationText += content[i]
      i++
    }
    if (i >= n) break

    const start = i
    let inString: string | null = null

    while (i < n) {
      const c = content[i]
      if (inString) {
        if (c === inString && content[i - 1] !== '\\') inString = null
        i++
        continue
      }
      if (c === '"' || c === '\'') {
        inString = c
        i++
        continue
      }
      if (c === '{' || c === ';' || c === '}') break
      i++
    }

    if (i >= n) {
      declarationText += content.slice(start, n)
      break
    }

    const delimiter = content[i]
    if (delimiter === ';') {
      declarationText += content.slice(start, i + 1)
      i++
      continue
    }

    if (delimiter === '{') {
      const j = findMatchingBrace(content, i)

      nestedBlocks.push(content.slice(start, j))
      i = j
      continue
    }

    i++
  }

  return {declarationText, nestedBlocks}
}

/**
 * Flatten nested CSS into standard flat CSS
 * Handles:
 * - Nested selectors (&, &&)
 * - Multiple nesting levels
 * - \@media, \@supports, \@keyframes, \@layer, \@font-face
 * - Selector-less fragments (adds :root)
 * - Curly braces inside strings
 * @param css declaration.
 * @returns flattened CSS.
 */
export function flattenNestedCSS(css: string): string {
  css = stripComments(css)

  const rules: CSSRule[] = []

  const hasTopLevelSelector = /^[^{]+{/.test(css)
  if (!hasTopLevelSelector) {
    css = `${IMPLICIT_ROOT} {\n${css}\n}`
  }

  // Parse block safely with string awareness
  function processBlock(
    block: string,
    parentSelectors: string[] = [],
    media: string | null = null
  ): void {
    if (findNonStringChar(block, '{') === -1) {
      const declarations = buildDeclarations(block)
      if (declarations) {
        rules.push({
          selectors: parentSelectors.length ? parentSelectors : [IMPLICIT_ROOT],
          declarations,
          media
        })
      }
      return
    }

    let i = 0
    const n = block.length

    while (i < n) {
      if (/\s/.test(block[i])) {
        i++
        continue
      }

      // handle at-rules like @media, @supports, @keyframes, etc.
      if (block[i] === '@' && block[i + 1] && block.slice(i).match(/^@[\w-]+/)) {
        const atStart = i
        i = findNonStringChar(block, '{', i)
        if (i === -1) break
        const atRule = block.slice(atStart, i).trim()

        const j = findMatchingBrace(block, i)

        const inner = block.slice(i + 1, j - 1)
        processBlock(inner, parentSelectors, atRule)
        i = j
        continue
      }

      // selector block
      const selStart = i
      const braceIndex = findNonStringChar(block, '{', selStart)
      if (braceIndex === -1) break

      const rawSelector = block.slice(selStart, braceIndex).trim()
      i = braceIndex + 1

      const j = findMatchingBrace(block, i - 1)

      const content = block.slice(i, j - 1).trim()
      i = j

      // split selectors safely
      const selectors = rawSelector
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)

      const resolvedSelectors = selectors.flatMap(sel => {
        if (!parentSelectors.length) return [sel]
        return parentSelectors.map(parent => {
          if (sel.includes('&')) {
            return sel
              .replace(/&&/g, `${parent}${parent}`)
              .replace(/&/g, parent)
          }
          return `${parent} ${sel}`
        })
      })

      const {declarationText, nestedBlocks} = splitDeclarationsAndNestedBlocks(content)

      // Extract only declarations (lines with :)
      const declarations = buildDeclarations(declarationText)

      if (declarations) {
        rules.push({
          selectors: resolvedSelectors,
          declarations,
          media
        })
      }

      // Process nested blocks (selectors or at-rules)
      if (nestedBlocks.length > 0) {
        processBlock(nestedBlocks.join('\n'), resolvedSelectors, media)
      }
    }
  }

  processBlock(css)

  // Group rules by media/at-rule
  const grouped: Record<string, CSSRule[]> = {}
  for (const rule of rules) {
    const key = rule.media ?? 'root'
    grouped[key] ||= []
    grouped[key].push(rule)
  }

  // Build output
  let output = ''
  for (const key in grouped) {
    if (key !== 'root') output += `${key} {\n`

    for (const rule of grouped[key]) {
      output += `${rule.selectors.join(', ')} {\n${rule.declarations}\n}\n\n`
    }

    if (key !== 'root') output += `}\n\n`
  }

  return output.trim()
}
