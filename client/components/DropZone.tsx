import React, { Dispatch, FunctionComponent, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const DropZone: FunctionComponent<{ setFile: Dispatch<any> }> = ({
  setFile,
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles)
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: {
        'image/jpeg': ['.jpeg', '.png'],
        'image/png': ['.jpeg', '.png'],
        'audio/mpeg': [],
      },
    })
  return (
    <div className="w-full p-4">
      <div
        {...getRootProps()}
        className="h-80 w-full cursor-pointer rounded-md focus:outline-none"
      >
        <input {...getInputProps()} />

        <div
          className={
            'flex h-full flex-col items-center justify-center space-y-3 rounded-xl border-2 border-dashed border-yellow-light ' +
            (isDragReject ? 'border-red-500' : '') +
            (isDragAccept ? 'border-green-500' : '')
          }
        >
          <img src="/images/folder.png" alt="folder" className="h-16 w-16" />

          {isDragReject ? (
            <p>Sorry,This app only supports images and mp3</p>
          ) : (
            <>
              <p>Drag and Frop files here</p>
              <p className="mt-2 text-base text-gray-300">
                Only PNG , JPG and MP3 are supported{' '}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DropZone
