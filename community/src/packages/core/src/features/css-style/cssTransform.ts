import {parse} from './parse'

// original https://github.com/staxmanade/CssToReact/blob/gh-pages/src/transform.js

const mediaNameGenerator = (name: string) => `@media ${name}`

const nameGenerator = (name: string) => {
  return name
    .replace(/\s\s+/g, ' ')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/^_+/g, '')
    .replace(/_+$/g, '')
}

const cleanPropertyName = (name: string) => {
  // turn things like 'align-items' into 'alignItems'
  return name.replace(/(-.)/g, v => v[1].toUpperCase())
}

function transformRules(rules: any, result: any) {
  rules.forEach((rule: any) => {
    const obj: any = {}
    if (rule.type === 'media') {
      const name = mediaNameGenerator(rule.media)
      const media = result[name] = result[name] || {
        '__expression__': rule.media
      }
      transformRules(rule.rules, media)
    } else if (rule.type === 'rule') {
      rule.declarations.forEach((declaration: any) => {
        if (declaration.type === 'declaration') {
          const cleanProperty = cleanPropertyName(declaration.property)
          obj[cleanProperty] = declaration.value
        }
      })
      rule.selectors.forEach(function (selector: string) {
        const name = nameGenerator(selector.trim())
        result[name] = obj
      })
    }
  })
}

/**
 * Converts a CSS string into an object compatible with CSSProperties.
 * @param inputCssText the CSS string.
 * @returns the object compatible with CSSProperties.
 */
function transformCssString(inputCssText?: string) {
  if (!inputCssText) return

  // If the input "css" doesn't wrap it with a css class (raw styles)
  // we need to wrap it with a style so the css parser doesn't choke.
  let bootstrapWithCssClass = false
  if (inputCssText.indexOf('{') === -1) {
    bootstrapWithCssClass = true
    inputCssText = `.bootstrapWithCssClass { ${inputCssText} }`
  }

  const css = parse(inputCssText)
  let result: any = {}
  transformRules(css.stylesheet.rules, result)

  // Don't expose the implementation detail of our wrapped css class.
  if (bootstrapWithCssClass) {
    result = result.bootstrapWithCssClass
  }

  return result
}

/**
 * Converts a CSS string into an object compatible with CSSProperties. Returns undefined if there were exceptions.
 * @param css the CSS string.
 * @returns the object compatible with CSSProperties.
 */
export function silentTransformCssString(css?: string) {
  try {
    return transformCssString(css)
  } catch (ignored) {
    // do nothing
  }
}
