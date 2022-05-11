import React, { FunctionComponent } from 'react'
import { sizeInMb } from '../lib/sizeInMb'
import { IFile } from '../lib/types'

const RenderFile: FunctionComponent<{
  file: IFile
}> = ({ file: { format, name, sizeInByte } }) => {
  return (
    <div className="my-2 flex w-full items-center p-4">
      <img src={`/images/${format}.png`} alt="" className="h-14 w-14"></img>
      <span className="mx-2">
        {name.length < 20 ? name : name.slice(0, 20) + '...'}
      </span>
      <span className="ml-auto">{sizeInMb(sizeInByte)}</span>
    </div>
  )
}

export default RenderFile
