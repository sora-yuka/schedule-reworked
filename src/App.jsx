import { AuthProvider } from './presentation/contexts/authContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'

import HomePage from './presentation/pages/Home/HomePage'
import LoginPage from './presentation/pages/Login/LoginPage'


export default function App() {

    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" />
                    <Route path="/login" element={ <LoginPage /> } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
