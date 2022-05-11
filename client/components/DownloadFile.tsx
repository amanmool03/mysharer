import React, { FunctionComponent } from 'react'

const DownloadFile: FunctionComponent<{ downloadPageLink: string }> = ({
  downloadPageLink,
}) => {
  return (
    <div className="p-1">
      <h1 className="my-2 text-lg font-medium">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit in dolorem
        pariatur reprehenderit sint sed unde doloremque quaerat repellendus
        dignissimos atque veritatis exercitationem dolore voluptate dolor, eos
        nulla minus nesciunt!
      </h1>
      <div className="flex space-x-3">
        <span className="break-all">{downloadPageLink}</span>
        <img
          src="/images/copy.png"
          alt=""
          className="h-8 w-8 cursor-pointer object-contain"
          onClick={() => navigator.clipboard.writeText(downloadPageLink)}
        />
      </div>
    </div>
  )
}

export default DownloadFile
