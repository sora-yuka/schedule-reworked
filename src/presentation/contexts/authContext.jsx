import { useContext, createContext, useEffect, useState, useCallback  } from 'react'
import { useNavigate } from 'react-router-dom'

const HTTP_STATUS = {
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
}

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    const baseUrl = import.meta.env.VITE_API_ENDPOINT + "api/v1/account/"

    const secureStorage = {
        setItem: (key, value) => localStorage.setItem(key, value),
        getItem: (key) => localStorage.getItem(key),
        removeItem: (key) => localStorage.removeItem(key),
    }

    const authFetch = useCallback(async(url, options = { }) => { 
        const headers = {
            "Content-Type": "application/json",
            ...options.headers 
        }

        const token = secureStorage.getItem("access_token")
        if (token) headers.Authorization = `Bearer ${token}`

        try {
            const response = await fetchTimeout(url, { ...options, headers })

            if (response.status === HTTP_STATUS.UNAUTHORIZED) {
                const newToken = await refreshToken()
                headers.Authorization = `Bearer ${newToken}`
                return await fetchTimeout(url, { ...options, headers })
            }
            return response
        } catch(error) {
            throw error
        }
    })

    const refreshToken = useCallback(async() => {
        try {
            const refresh_token = secureStorage.getItem("refresh_token")
            if (!refreshToken) throw Error("Refresh token not found")
            
            const response = await fetch(baseUrl + "refresh/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh_token }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to refresh token")
            }

            const data = await response.json()
            secureStorage.setItem("access_token", data.access)
            return data
        } catch(error) {
            secureStorage.removeItem("access_token")
            secureStorage.removeItem("refresh_token")
            throw error
        }
    }, [ baseUrl ])

    useEffect(() => {
        let isMounted = true

        const checkAuth = async() => {
            try {
                const response = await authFetch(baseUrl + "check-auth/")

                if (isMounted) {
                    setIsAuthenticated(response.ok)
                    setIsLoading(false)
                    if (!response.ok) navigate("/login")
                }
            } catch(error) {
                if (isMounted) {
                    setIsAuthenticated(false)
                    setIsLoading(false)
                    navigate("/login")
                }
            }
        }

        checkAuth()

        return () => { isMounted = false }
    }, [ navigate, authFetch, baseUrl ])

    const login = async(email, password) => {
        try {
            const response = await authFetch(baseUrl + "login/", {
                method: "POST",
                body: JSON.stringify({ email, password })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to log in")
            }

            const data = await response.json()
            secureStorage.setItem("access_token", data.access_token)
            secureStorage.setItem("refresh_token", data.refresh_token)
            setIsAuthenticated(true)
            return data
        } catch(error) {
            setIsAuthenticated(false)
            throw error
        }
    }

    const logout = () => {
        secureStorage.removeItem("access_token")
        secureStorage.removeItem("refresh_token")
        setIsAuthenticated(false)
        navigate("/home")
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, authFetch }}>
            { children }
        </AuthContext.Provider>
    )
}

const fetchTimeout = (url, options, timeout = 8000) => {
    return Promise.race([
        fetch(url, option),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeout))
    ])
}

export const useAuth = () => useContext(AuthContext)