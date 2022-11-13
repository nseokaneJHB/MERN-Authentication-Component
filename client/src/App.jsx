// Routing
import { Route, Routes, Navigate } from 'react-router-dom'

// Third Party
import { QueryClient, QueryClientProvider } from 'react-query'

// Components
import { Layout } from './components/Layout'

// Pages
import { SignIn } from "./pages/Sign-In"
import { SignUp } from "./pages/Sign-Up"
import { Settings } from "./pages/Settings"
import { ChangePassword } from "./pages/Change-Password"
import { AuthContextProvider } from './components/Auth-Context'

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Layout>
          <Routes>
            <Route path='/' element={ <Navigate to={'/sign-in'} /> } />
            <Route path='/sign-in' element={ <SignIn /> } />
            <Route path='/sign-up' element={ <SignUp /> } />
            <Route path='/settings' element={ <Settings /> } />
            <Route path='/password-change' element={ <ChangePassword /> } />
          </Routes>
        </Layout>
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
