import { useContext, createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HTTP_STATUS = {
    OK: 200,
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
}

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const navigate = useNavigate()

    const baseUrl = import.meta.env.VITE_API_ENDPOINT + "api/v1/account/"

    const secureStorage = {
        setItem: (key, value) => localStorage.setItem(key, value),
        getItem: (key) => localStorage.getItem(key),
        removeItem: (key) => localStorage.removeItem(key),
    }

    useEffect(() => {
        const checkAuth = async() => {
            try {
                const response = await fetch(baseUrl + "check-auth/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${secureStorage.getItem("access_token")}`,
                    }
                })
    
                if (response.status === HTTP_STATUS.UNAUTHORIZED) { 
                    const refreshResponse = await refresh()
                }
            } catch(error) {
                console.error("Failed to check auth permissions: ", error)
            }
        }

        checkAuth()
    }, [ ])

    const refresh = async() => {
        try {
            const refresh_token = secureStorage.getItem("refresh_token")

            const response = await fetch(baseUrl + "refresh/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "refresh": refresh_token }),
            })

            if (response.status !== HTTP_STATUS.OK) {
                setIsAuthenticated(false)
                navigate("/login")
            }

            const data = await response.json()
            secureStorage.setItem("access_token", data["access"])
            setIsAuthenticated(true)

            return response
        } catch(error) {
            console.error("Failed to refresh user token: ", error)
        }
    }

    const login = async(email, password) => {
        const response = await fetch(baseUrl + "login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

        if (response.status === HTTP_STATUS.BAD_REQUEST) {
            throw new Error("User with given credentials not found.")
        }

        const data = await response.json()
        secureStorage.setItem("access_token", data["access"])
        secureStorage.setItem("refresh_token", data["refresh"])

        return response
    }

    const logout = () => {
        secureStorage.removeItem("access_token")
        secureStorage.removeItem("refresh_token")
        setIsAuthenticated(false)
        navigate("/login")
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)