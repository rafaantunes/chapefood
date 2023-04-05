import { Provider as AppContextProvider } from '@/contexts/app'
import { Provider as AuthContextProvider } from '@/contexts/auth'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return(
    <AuthContextProvider>
      <AppContextProvider>
        <Component {...pageProps}/>
      </AppContextProvider>
    </AuthContextProvider>
  );
}
