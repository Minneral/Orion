import Footer from "../components/Footer";
import Header from "../components/Header";

import s from "../assets/styles/watchedpage.module.scss";
import sForm from "../assets/styles/authpage.module.scss";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useEffect, useRef } from "react";
import { useAuth } from "../components/AuthProvider";
import { api } from "../services/api";
import axios from "axios";

export default function SettingsPage() {

  const navigate = useNavigate();
  const email = useRef<HTMLInputElement>(null)
  const fio = useRef<HTMLInputElement>(null)
  const user = useAuth();

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

  const showSuccess = (message: string) => {
    toast.success(message, {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vEmail = email.current?.value;
    const vFio = fio.current?.value;

    try {

      if (!vEmail || !vFio)
        throw Error("Поля не могут быть пустыми!");

      api.post('/settings', { "email": vEmail, "profile_name": vFio })
        .then(_ => {
          showSuccess("Данные успешно обновлены!");
        })
        .catch(res => {
          throw Error(res.message);
        })
    }
    catch (error) {
      if (axios.isAxiosError(error)) {

        const serverResponse = error.response;
        if (serverResponse) {
          const message = serverResponse.data['message'];
          showError(message);
        }
      }
      else {
        if (error instanceof Error) {
          showError(error.message);
        }
      }
    }
  }

  useEffect(() => {
    if (email.current && user) {
      email.current.value = user.email;
    }

    if (fio.current && user) {
      fio.current.value = user.profile_name;
    }

  }, []);


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
          <div className={s.main__inner}>
            <div className={s.main__title}>Настройки:</div>

            <div className={s.main__content}>

              <div className={s.main__back} onClick={() => navigate('/profile')}>Назад</div>

              <form className={sForm.main__form} onSubmit={handleSubmit}>
                <input className={sForm.main__input} ref={email} type="text" placeholder="Email" />
                <input className={sForm.main__input} ref={fio} type="text" placeholder="ФИО" />
                <input className={sForm.main__submit} type="submit" value="Сохранить изменения" />
              </form>


            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
