import Footer from "../components/Footer";
import Header from "../components/Header";
import Cookies from "js-cookie";

import s from "../assets/styles/authpage.module.scss";

import background_img from "../assets/images/background.png";
import { api, api_login } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import axios from "axios";

export default function SignInPage() {
    const navigate = useNavigate();

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

    useEffect(() => {
        if (Cookies.get('user')) {
            navigate('/');
        }
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const formData = new FormData(event.currentTarget);
            const username = formData.get('username') as string;
            const password = formData.get('password') as string;

            if(!(username && password))
                throw Error("Заполните все поля!");

            try {
                const response = await api_login({ 'username': username, 'password': password })
                if (response.status == 200) {
                    let data = response.data['token'];
                    Cookies.set('JWT', data);
                    api.get('/user')
                        .then(response => {
                            if (response.status == 200) {
                                let data = JSON.stringify(response.data);
                                Cookies.set('user', data, { expires: 7 })
                                location.reload();
                            }
                        })
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    // Обработка ошибок Axios
                    const serverResponse = error.response;
                    if (serverResponse) {
                        const message = serverResponse.data['message'];
                        showError(message);
                    }
                }
            }
        }
        catch (e) {
            if (e instanceof Error) {
                showError(e.message);
            }
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
                            <div className={s.main__title}>Авторизация</div>

                            <form className={s.main__form} onSubmit={handleSubmit}>
                                <input type="text" placeholder="Имя пользователя" className={s.main__input} name="username" />
                                <input type="password" placeholder="Пароль" className={s.main__input} name="password" />

                                <button className={s.main__submit} type="submit">Войти</button>
                            </form>

                            <div className={s.main__nav}>
                                <span>Нет аккаунта?</span>
                                <span onClick={() => navigate('/signup')}>Регистрация</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
