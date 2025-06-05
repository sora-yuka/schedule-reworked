import { useState, useCallback } from 'react'
import { useAuth } from '../../contexts/authContext'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import Button from '../../components/ui/Button/Button.jsx'

import './LoginPage.css'


export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = useCallback(async(event) => {
        event.preventDefault()

        await toast.promise(
            login(email, password),
            {
                loading: "Loading...",
                success: "Successfully logged in!",
                error: "Wrong password or email!",
            },
            {
                error: {
                    duration: 2500
                }
            }
        )

        setTimeout(() => {
            navigate("/")
        }, 1700)
    })

    return (
        <div className="login__wrapper">
            <div className="login__container">
                <div className="login__panel">
                    <h2 className="login__headline">Welcome back</h2>
                    <form className="login__form" onSubmit={ handleSubmit }>
                        <div className="login__field">
                            <label htmlFor="email" className="login__label">E-mail</label>
                            <input 
                                id="email"
                                type="text"
                                placeholder="Enter your e-mail"
                                value={ email }
                                className="login__input"
                                onChange={ (event) => setEmail(event.target.value) }
                            />
                        </div>
                        <div className="login__field">
                            <label htmlFor="password" className="login__label">Password</label>
                            <div className="login__field-password">
                                <input 
                                    id="password"
                                    type={ !showPassword ? "password" : "text" }
                                    placeholder="Enter your password"
                                    value={ password }
                                    className="login__input"
                                    onChange={ (event) => setPassword(event.target.value) }
                                />
                                <img 
                                    src={ !showPassword ? "/svg/eye-closed.svg" : "/svg/eye-opened.svg" } 
                                    alt="" 
                                    className="login__field-eye" 
                                    onClick={ () => { setShowPassword(!showPassword) } } 
                                />
                            </div>
                        </div>
                        <Button className="button__primary">
                            Войти
                        </Button>
                    </form>
                </div>
            </div>
            <Toaster />
        </div>
    )
}