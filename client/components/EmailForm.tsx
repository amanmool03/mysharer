import axios from 'axios'
import React, { FunctionComponent, useState } from 'react'

const EmailForm: FunctionComponent<{ id: string }> = ({ id }) => {
  const [emailFrom, setEmailFrom] = useState('')
  const [emailTo, setEmailTo] = useState('')
  const [message, setMessage] = useState(null)

  const handleEmail = async (e: any) => {
    e.preventDefault()
    try {
      const { data } = await axios({
        method: 'POST',
        url: 'api/files/email',
        data: {
          id,
          emailFrom,
          emailTo,
        },
      })
      setMessage(data.message)
    } catch (error: any) {
      setMessage(error.data.response.message)
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-3 p-2">
      <h3>you can also send the file through mail</h3>
      <form
        onSubmit={handleEmail}
        action=""
        className="flex w-full flex-col items-center justify-center space-y-3 p-2"
      >
        <input
          className="border-2 bg-gray-800 p-1 text-white focus:outline-none"
          type="email"
          placeholder="Email From"
          required
          value={emailFrom}
          onChange={(e) => setEmailFrom(e.target.value)}
        />
        <input
          type="email"
          className="border-2 bg-gray-800 p-1 text-white focus:outline-none"
          placeholder="Email To"
          required
          value={emailTo}
          onChange={(e) => setEmailTo(e.target.value)}
        />
        <button className="button" type="submit">
          Email
        </button>
      </form>
      {message && <p className="font-medium text-red-500">{message}</p>}
    </div>
  )
}

export default EmailForm
