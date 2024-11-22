import Footer from "../components/Footer";
import Header from "../components/Header";

import s from "../assets/styles/authpage.module.scss";

import background_img from "../assets/images/background.png";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { api_register } from "../services/api";
import { useQuery } from "../services/useQuerry";
import { Bounce, toast, ToastContainer } from "react-toastify";
import axios from "axios";

export default function SignUpPage() {

    const navigate = useNavigate();
    const querry = useQuery();

    useEffect(() => {
        if (Cookies.get('user')) {
            navigate('/');
        }

        if (querry.get('username')) {
            let inputElement = document.querySelector('input[name="username"]') as HTMLInputElement;
            inputElement.value = querry.get('username') || "";
        }
    }, [])

    const showError = (message: string) => {
        toast.error(message, {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const passwordConfirm = formData.get('passwordConfirm') as string;

        try {
            if(!(username && email && password && passwordConfirm))
                throw Error("Заполните все поля!");

            if (password == passwordConfirm) {
                try {
                    const response = await api_register({
                        'username': username,
                        'email': email,
                        'password': password
                    })
                    if (response.status == 200) {
                        navigate('/signin');
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        const serverResponse = error.response;
                        if (serverResponse) {
                            const message = serverResponse.data['message'];
                            throw Error(message);
                        }
                    }
                }
            }
            else {
                throw Error("Пароли не совпадают!");
            }
        }
        catch (e) {
            if (e instanceof Error)
                showError(e.message);
        }
    };

    return (
        <>
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <Header />
            <div className={s.main}>
                <div className="container">
                    <div className={s.main__inner} style={{
                        backgroundImage: `url(${background_img})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        minHeight: "665px"
                    }}>
                        <div className={s.main__content}>
                            <div className={s.main__title}>Регистрация</div>

                            <form className={s.main__form} onSubmit={handleSubmit}>
                                <input type="text" className={s.main__input} name="username" placeholder="Имя пользователя" />
                                <input type="text" className={s.main__input} name="email" placeholder="Email" />
                                <input type="password" className={s.main__input} name="password" placeholder="Пароль" />
                                <input type="password" className={s.main__input} name="passwordConfirm" placeholder="Повторите пароль" />

                                <button className={s.main__submit} type="submit">Зарегистрироваться</button>
                            </form>

                            <div className={s.main__nav}>
                                <span>Уже есть аккаунт?</span>
                                <span onClick={() => { navigate('/signin') }}>Авторизация</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
