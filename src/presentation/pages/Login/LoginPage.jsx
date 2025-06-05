import { useState, useCallback } from 'react'
import { useAuth } from '../../contexts/authContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button/Button.jsx'

import './LoginPage.css'


export default function LoginPage() {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
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
        <div className="login-wrapper">
            <Button onClick={ handleSubmit }>toast example</Button>
        </div>
    )
}