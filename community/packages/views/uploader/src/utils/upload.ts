import type {FileType, OnError, OnSuccess} from '../types'

type UploadResult = {
  filePath?: string
  status?: FileType['status']
  error?: string
}

const isFailed = ({filePath, error, status}: UploadResult): boolean => {
  return status === 'error' || !!error || !filePath
}

const createItem = (file: File, result: UploadResult): FileType => {
  const {filePath, status, error} = result

  const item: FileType = {
    name: file.name,
    fileKey: Date.now() + Math.random(),
    blobFile: file,
    status,
    error
  }

  if (!isFailed(result)) {
    item.url = filePath
  }

  return item
}

const uploadFile = async (file: File, action: string): Promise<FileType> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(action, {
      method: 'POST',
      body: formData,
    })
    const result = await response.json()

    return createItem(file, result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown upload error'
    console.error('Upload error for file:', file.name, error)

    return createItem(file, {
      status: 'error',
      error: message
    })
  }
}

/**
 * Uploads multiple files and calls success/error callbacks.
 * @param files the array of files to upload.
 * @param action the URL to upload files to.
 * @param onSuccess the callback function that is called when upload results on success.
 * @param onError the callback function that is called with error on failure.
 */
export const uploadFiles = async (files: File[], action: string, onSuccess?: OnSuccess, onError?: OnError) => {
  const uploadResults: FileType[] = []

  for (const file of files) {
    const result = await uploadFile(file, action)
    uploadResults.push(result)
  }

  if (uploadResults.some(isFailed)) {
    const error = new Error('Some files failed to upload')
    onError?.(error, uploadResults)
  } else {
    onSuccess?.(uploadResults)
  }
}
