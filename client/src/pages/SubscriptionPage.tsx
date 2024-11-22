import Footer from "../components/Footer";
import Header from "../components/Header";

import s from "../assets/styles/watchedpage.module.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { api } from "../services/api";
import Cookies from "js-cookie";

export default function SubscriptionPage() {

    const navigate = useNavigate();
    const user = useAuth();

    const handleClick = () => {

        const updateUser = async () => {
            api.get('/user').then(response => response.data)
                .then(data => {
                    const _user = JSON.stringify(data);
                    Cookies.set('user', _user)
                    console.log(Cookies.get('user'))
                    location.reload();
                })
        }

        if (user?.subscription_level == "Премиум") {
            api.post("/subscription", { "subscription_level": "Базовый" })
                .then(_ => updateUser())
        }
        else {
            api.post("/subscription", { "subscription_level": "Премиум" })
                .then(_ => updateUser())
        }

    }

    return (
        <>
            <Header />
            <div className={s.main}>
                <div className="container">
                    <div className={s.main__inner}>
                        <div className={s.main__title}>Управление подпиской:</div>

                        <div className={s.main__content}>
                            {
                                user?.subscription_level == "Премиум" ?
                                    <div className={s.main__back} onClick={handleClick}>Обновить уровень до Базового</div>
                                    :
                                    <div className={s.main__back} onClick={handleClick}>Обновить уровень до Премиум</div>
                            }

                            <div className={s.main__back} onClick={() => navigate('/profile')}>Назад</div>


                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
