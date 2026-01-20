import {IndexedDbFormStorage} from '@react-form-builder/indexed-db-form-storage'
import {useEffect, useState} from 'react'

interface IndexedDbStorageState {
  formStorage?: IndexedDbFormStorage
  initialized: boolean
  error?: Error
  indexedDbExists: boolean
}

/**
 * Hook for managing IndexedDB form storage
 * @param dbName Name of the IndexedDB database.
 * @param storeName Name of the IndexedDB object store.
 * @param forms Initial forms to store in IndexedDB.
 * @returns Object containing storage state and utilities
 */
export function useIndexedDbStorage(dbName: string, storeName: string, forms?: Record<string, any>) {
  const indexedDbExists = !!globalThis.indexedDB
  const [state, setState] = useState<IndexedDbStorageState>({
    formStorage: undefined,
    initialized: !indexedDbExists,
    error: undefined,
    indexedDbExists,
  })

  useEffect(() => {
    if (!indexedDbExists) return

    const storage = new IndexedDbFormStorage(dbName, storeName)

    storage
      .init(forms || {})
      .then(() => setState({formStorage: storage, initialized: true, error: undefined, indexedDbExists}))
      .catch(e => {
        console.error('Failed to initialize IndexedDB storage:', e)
        setState({formStorage: undefined, initialized: true, error: e as Error, indexedDbExists})
      })
  }, [dbName, storeName, forms, indexedDbExists])

  return state
}
