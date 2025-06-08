import SidebarComponent from '../../components/layout/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

import './HomePage.css'


export default function HomePage() {
    return (
        <div className="main__wrapper">
            <SidebarComponent />
            <Outlet />
        </div>
    )
}