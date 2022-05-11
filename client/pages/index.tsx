import type { NextPage } from 'next'
import { useState } from 'react'
import DropZone from '../components/DropZone'
import RenderFile from '../components/RenderFile'
import axios from 'axios'
import DownloadFile from '../components/DownloadFile'
import EmailForm from '../components/EmailForm'

const Home: NextPage = () => {
  const [file, setFile] = useState<any>(null)
  const [id, setId] = useState('')
  const [downloadPageLink, setDownloadPageLink] = useState(null)
  const [uploadState, setUploadState] = useState<
    'Uploading' | 'Upload failed' | 'Uploaded' | 'Upload'
  >('Upload')

  const onUploadHandler = async () => {
    setUploadState('Uploading')

    if (uploadState === 'Uploading') {
      return
    }

    const formData = new FormData()
    formData.append('myFile', file)
    try {
      const { data } = await axios({
        method: 'post',
        data: formData,
        url: 'api/files/upload',
        headers: {
          'Content-Type': 'multipart/formData',
        },
      })
      setDownloadPageLink(data.downloadPageLink)
      setId(data.id)
      setUploadState('Uploaded')
    } catch (error: any) {
      console.log(error.response.data)
      setUploadState('Upload failed')
    }
  }

  const resetFile = () => {
    setFile(null)
    setDownloadPageLink(null)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="my-4 text-3xl font-medium">
        Got a file? Share the file you want
      </h1>
      <div className="flex w-96 flex-col items-center justify-center rounded-xl bg-gray-800 shadow-xl">
        {!downloadPageLink && <DropZone setFile={setFile} />}

        {console.log(file)}
        {file && (
          <RenderFile
            file={{
              format: file.type.split('/')[1],
              name: file.name,
              sizeInByte: file.size,
            }}
          />
        )}
        {!downloadPageLink && file && (
          <button onClick={onUploadHandler} className="button">
            {uploadState}
          </button>
        )}

        {downloadPageLink && (
          <div className="p-2 text-center">
            <DownloadFile downloadPageLink={downloadPageLink} />

            <EmailForm id={id} />

            <button onClick={resetFile} className="button">
              Upload new file
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
