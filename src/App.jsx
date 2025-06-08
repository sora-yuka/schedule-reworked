import { AuthProvider } from './presentation/contexts/authContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'

import HomePage from './presentation/pages/Home/HomePage.jsx'
import LoginPage from './presentation/pages/Login/LoginPage.jsx'
import PlaceHolderComponent from './presentation/components/layout/PlaceHolder/PlaceHolder.jsx'


export default function App() {

    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={ <HomePage /> }>
                        <Route path="/news" element={ <PlaceHolderComponent /> } />
                    </Route>
                    <Route path="/login" element={ <LoginPage /> } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
