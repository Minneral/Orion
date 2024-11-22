import { useNavigate } from "react-router-dom"
import s from "../assets/styles/header.module.scss"
import logo from "../assets/images/logo.png"
import search from "../assets/icons/search.png"
import userIcon from "../assets/icons/user.png"
import { useAuth } from "./AuthProvider"
import React, { FormEvent, useEffect } from "react"

export default function Header() {

    const searchInput = React.useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const user = useAuth();

    const handleLogoClick = () => {
        navigate('/');
    }

    const handleLoginClick = () => {
        navigate('/signin');
    }

    const handleProfileClick = () => {
        navigate('/profile');
    }

    const handleSearchClick = () => {
        if (searchInput.current) {
            searchInput.current.focus();
        }
    }

    const handleBurgerClick = (e: React.MouseEvent<HTMLElement>) => {
        const burger = e.target as HTMLElement;
        burger.classList.toggle(s.active);
        document.querySelector('.' + s.header__overlay)?.classList.toggle(s.active);
        document.querySelector('body')?.classList.toggle(s.lock);
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        navigate('/search?value=' + searchInput.current?.value);
    }

    useEffect(() => {
        const burger = document.querySelector('.' + s.burger);
        const body = document.querySelector('body');

        if (!burger?.classList.contains(s.active) && body?.classList.contains(s.lock)) {
            body.classList.remove(s.lock);
        }
    }, [])


    return (
        <header className={s.header}>
            <div className="container">
                <div className={s.header__inner}>

                    <div className={s.header__logo} onClick={handleLogoClick}>
                        <img src={logo} alt="logo" />
                    </div>

                    <div className={s.header__burger} onClick={handleBurgerClick}>
                        <span></span>
                    </div>

                    <div className={s.header__overlay}>


                        <div className={s.header__nav}>
                            <div className={s.header__navLink} onClick={() => navigate('/')}>Главная</div>
                            <div className={s.header__navLink} onClick={() => navigate('/movies')}>Фильмы</div>
                            <div className={s.header__navLink} onClick={() => navigate('/seriess')}>Сериалы</div>
                        </div>

                        {
                            user == null ?
                                <div className={s.header__login} onClick={handleLoginClick}>
                                    Войти
                                </div>
                                :
                                <div className={s.header__profile}>
                                    <div className={s.header__search} onClick={handleSearchClick}>
                                        <img src={search} alt="search" />
                                        <form onSubmit={handleSubmit}>
                                            <input ref={searchInput} type="text" placeholder="начните вводить" />
                                        </form>
                                    </div>

                                    <div onClick={() => navigate('/subscription')} className={s.header__subscription + " " + (user.subscription_level == "Базовый" ? s.gray : "")}>
                                        {user.subscription_level}
                                    </div>

                                    <img className={s.header__user} src={userIcon} alt="user" onClick={handleProfileClick} />
                                </div>
                        }
                    </div>
                </div>

            </div>
        </header>
    )
}
