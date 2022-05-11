import '../styles/globals.css'
import type { AppProps } from 'next/app'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:5000/'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="grid h-screen place-items-center bg-gray-900 text-white">
      <div>
        <Component {...pageProps} />
      </div>
    </div>
  )
}

export default MyApp
