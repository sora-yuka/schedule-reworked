import { useState, useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { ThemeContext } from '../../../contexts/themeContext.jsx'
import Button from '../../ui/Button/Button.jsx'

import './Sidebar.css'


export default function SidebarComponent() {
    const { theme, toggleTheme } = useContext(ThemeContext)

    const tab = "sidebar__tab"
    const activeTab = "sidebar__tab--active"
    const [checked, setChecked]  = useState(theme === "dark-theme")

    useEffect(() => {
        setChecked(theme === "dark-theme")
    }, [ ])

    const buttonToggle = () => {
        setChecked(prevState => !prevState)
        toggleTheme()
    }

    return (
        <div className="sidebar__wrapper">
            <div className="sidebar__container">
                <div className="sidebar__logo">
                    <img src="/svg/linkrel-icon.svg" alt="icon" /> Edu.hub
                </div>
                <ul className="sidebar__list">
                    <li className="sidebar__list-item">
                        <NavLink to="/" className={ ({isActive}) => isActive ? activeTab : tab }>
                            <img src="/svg/sidebar/schedule.svg" alt="" />
                            Расписание
                        </NavLink>
                    </li>
                    <li className="sidebar__list-item">
                        <NavLink to="/news" className={ ({isActive}) => isActive ? activeTab : tab }>
                            <img src="/svg/sidebar/news.svg" alt="" />
                            Новости
                        </NavLink>
                    </li>
                    <li className="sidebar__list-item">
                        <NavLink to="/course" className={ ({isActive}) => isActive ? activeTab : tab }>
                            <img src="/svg/sidebar/books.svg" alt="" />
                            Курсы
                        </NavLink>
                    </li>
                </ul>
                <div className="sidebar__toggle-theme">
                    <Button className="button__toggle-theme" onClick={ buttonToggle }>
                        Темная тема
                    </Button>
                    <div className="sidebar__switch-round">
                        <label className="switch">
                            <input type="checkbox"
                                checked={ checked } 
                                onChange={ buttonToggle } 
                            />
                            <span className="switch__slider" />
                        </label>
                    </div>
                </div>
            </div>
            <div className="sidebar__profile">
                here might be user profile!
            </div>
        </div>
    )
}