import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { WishlistProvider } from './context/WishlistContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { LocationProvider } from './context/LocationContext.tsx'
import { Provider } from 'react-redux'
import { store } from './db/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LocationProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </LocationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
