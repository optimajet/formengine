/* eslint-disable import/no-nodejs-modules, import/no-extraneous-dependencies */
import type {ExtractorConfig, ExtractorResult, IExtractorInvokeOptions} from '@microsoft/api-extractor'
import {CompilerState, Extractor} from '@microsoft/api-extractor'
import {existsSync} from 'node:fs'
import {createRequire} from 'node:module'
import {normalize, resolve} from 'node:path'
import type {Plugin, PluginOption, ResolvedConfig} from 'vite'
import type {PluginOptions as DtsPluginOptions} from 'vite-plugin-dts'
import dts from 'vite-plugin-dts'

const PLUGIN_NAME = 'api-extractor-compiler-state'
const TYPESCRIPT_EXTENSION_PATTERN = /[.][mc]?tsx?$/

interface BuildRegistration {
  declarationEntryPoints: readonly string[]
  compilerState: CompilerState | undefined
  missingEntryPointsLogged: boolean
}

const registrationsByEntryPoint = new Map<string, BuildRegistration>()
const require = createRequire(import.meta.url)
const originalExtractorInvoke = Extractor.invoke.bind(Extractor)
let isExtractorPatched = false

/**
 * Resolves the Extractor class vite-plugin-dts imported, so the monkey-patch cannot silently miss a nested copy.
 * @returns the Extractor export as seen from vite-plugin-dts, plus the resolved package paths.
 */
const getVitePluginDtsExtractor = (): {
  extractor: typeof Extractor
  ourPath: string
  dtsPath: string
} => {
  const ourPath = require.resolve('@microsoft/api-extractor')
  const dtsPath = require.resolve('@microsoft/api-extractor', {paths: [require.resolve('vite-plugin-dts')]})
  const extractor = (require(dtsPath) as {Extractor: typeof Extractor}).Extractor
  return {extractor, ourPath, dtsPath}
}

const assertSameExtractorInstanceAsVitePluginDts = (): void => {
  const {extractor: dtsExtractor, ourPath, dtsPath} = getVitePluginDtsExtractor()
  if (dtsExtractor === Extractor && dtsExtractor.invoke === Extractor.invoke && ourPath === dtsPath) {
    return
  }

  throw new Error(
    `[${PLUGIN_NAME}] Patched @microsoft/api-extractor is not the instance vite-plugin-dts uses ` +
      `(ours: ${ourPath}, vite-plugin-dts: ${dtsPath}). Shared CompilerState will not apply.`
  )
}

const invokeWithSharedCompilerState = (extractorConfig: ExtractorConfig, options?: IExtractorInvokeOptions): ExtractorResult => {
  if (options?.compilerState) {
    return originalExtractorInvoke(extractorConfig, options)
  }

  const mainEntryPoint = normalize(resolve(extractorConfig.mainEntryPointFilePath))
  const registration = registrationsByEntryPoint.get(mainEntryPoint)
  if (!registration) {
    return originalExtractorInvoke(extractorConfig, options)
  }

  if (!registration.compilerState) {
    const missingEntryPoints = registration.declarationEntryPoints.filter((entryPoint) => !existsSync(entryPoint))
    if (missingEntryPoints.length > 0) {
      if (!registration.missingEntryPointsLogged) {
        registration.missingEntryPointsLogged = true
        console.warn(
          `[${PLUGIN_NAME}] Skipping shared CompilerState because ${missingEntryPoints.length} declaration file(s) do not exist yet.`
        )
      }
      return originalExtractorInvoke(extractorConfig, options)
    }

    registration.compilerState = CompilerState.create(extractorConfig, {
      additionalEntryPoints: [...registration.declarationEntryPoints],
      typescriptCompilerFolder: options?.typescriptCompilerFolder,
    })
  }

  return originalExtractorInvoke(extractorConfig, {...options, compilerState: registration.compilerState})
}

const installExtractorPatch = (): void => {
  if (isExtractorPatched) {
    return
  }

  assertSameExtractorInstanceAsVitePluginDts()
  Extractor.invoke = invokeWithSharedCompilerState
  isExtractorPatched = true
}

const uninstallExtractorPatchIfIdle = (): void => {
  if (registrationsByEntryPoint.size > 0 || !isExtractorPatched) {
    return
  }

  Extractor.invoke = originalExtractorInvoke
  isExtractorPatched = false
}

const unregister = (registration: BuildRegistration): void => {
  for (const entryPoint of registration.declarationEntryPoints) {
    if (registrationsByEntryPoint.get(entryPoint) === registration) {
      registrationsByEntryPoint.delete(entryPoint)
    }
  }

  uninstallExtractorPatchIfIdle()
}

const getDeclarationEntryPoints = (config: ResolvedConfig): string[] => {
  const libraryOptions = config.build.lib
  if (!libraryOptions) {
    return []
  }

  const entry = libraryOptions.entry
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return []
  }

  const outputDirectory = resolve(config.root, config.build.outDir)
  return Object.keys(entry).map((entryName) =>
    normalize(resolve(outputDirectory, `${entryName.replace(TYPESCRIPT_EXTENSION_PATTERN, '')}.d.ts`))
  )
}

const apiExtractorCompilerStatePlugin = (): Plugin => {
  let declarationEntryPoints: string[] = []
  let registration: BuildRegistration | undefined = undefined

  const unregisterCurrent = (): void => {
    if (!registration) {
      return
    }

    unregister(registration)
    registration = undefined
  }

  return {
    name: PLUGIN_NAME,
    apply: 'build',
    configResolved(config) {
      declarationEntryPoints = getDeclarationEntryPoints(config)
    },
    buildStart() {
      unregisterCurrent()
      if (declarationEntryPoints.length < 2) {
        return
      }

      registration = {
        declarationEntryPoints,
        compilerState: undefined,
        missingEntryPointsLogged: false,
      }
      for (const entryPoint of declarationEntryPoints) {
        registrationsByEntryPoint.set(entryPoint, registration)
      }
      installExtractorPatch()
    },
    closeBundle() {
      unregisterCurrent()
    },
  }
}

/**
 * Returns the Vite plugins for a library build that rolls up `.d.ts` files.
 * Includes a temporary workaround that reuses one API Extractor CompilerState across multi-entry rollups.
 * @param options additional vite-plugin-dts options merged over the default rollup configuration.
 * @returns the compiler-state plugin followed by vite-plugin-dts.
 */
export function libDts(options?: DtsPluginOptions): PluginOption {
  return [
    apiExtractorCompilerStatePlugin(),
    dts({rollupTypes: true, tsconfigPath: './bundle.tsconfig.json', ...options}),
  ]
}
