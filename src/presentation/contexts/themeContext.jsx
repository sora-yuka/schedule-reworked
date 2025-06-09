import { useEffect, createContext, useState, useContext } from 'react'

const ThemeContext = createContext()

const getTheme = () => {
    const storedTheme = localStorage.getItem("theme")
    const userPreference = window.matchMedia('(prefers-color-scheme: dark)')

    if (storedTheme) {
        return storedTheme
    } else if (userPreference) {
        localStorage.setItem("theme", "dark-theme")
        return "dark-theme"
    } else {
        localStorage.setItem("theme", "light-theme")
        return "light-theme"
    }
}

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getTheme)

    const toggleTheme = () => {
        setTheme(prevState => {
            const newTheme = prevState === "dark-theme" ? "light-theme" : "dark-theme"
            localStorage.setItem("theme", newTheme)
            return newTheme
        })
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            { children }
        </ThemeContext.Provider>
    )
}

export { ThemeContext, ThemeProvider }