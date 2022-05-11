import axios from 'axios'
import { GetServerSidePropsContext, NextPage } from 'next'
import React from 'react'
import RenderFile from '../../../components/RenderFile'
import { IFile } from '../../../lib/types'
import fileDownload from 'js-file-download'

const index: NextPage<{ file: IFile }> = ({
  file: { format, name, sizeInByte, id },
}) => {
  const onDownloadHandler = async () => {
    const { data } = await axios.get(
      `http://localhost:5000/api/files/${id}/download`,
      {
        responseType: 'blob',
      }
    )
    fileDownload(data, name)
  }
  return (
    <div className="flex w-96 flex-col items-center justify-center space-y-4 rounded-md bg-gray-800 py-3 shadow-xl">
      {!id ? (
        <span>File doesnot exist ! check URL</span>
      ) : (
        <>
          <img src="/images/file-download.png" alt="" className="h-16 w-16" />
          <h1 className="text-xl">Your file is ready to be downloaded</h1>
          <RenderFile file={{ format, name, sizeInByte }} />
          <button className="button" onClick={onDownloadHandler}>
            Download
          </button>
        </>
      )}
    </div>
  )
}

export default index

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query
  let file
  try {
    const { data } = await axios.get(`http://localhost:5000/api/files/${id}`)

    file = data
    console.log(file)
  } catch (error: any) {
    console.log(error.respose.data)
    file = {}
  }
  return {
    props: {
      file,
    }, // will be passed to the page component as props
  }
}
