import { useContext } from 'react'
import SidebarComponent from '../../components/layout/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import { ThemeContext } from '../../contexts/themeContext'

import './HomePage.css'


export default function HomePage() {
    const { theme } = useContext(ThemeContext)

    return (
        <div className={ `main__wrapper ${theme}` }>
            <SidebarComponent />
            <Outlet />
        </div>
    )
}