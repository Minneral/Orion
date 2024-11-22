import Footer from "../components/Footer";
import Header from "../components/Header";

import s from "../assets/styles/watchedpage.module.scss";
import sForm from "../assets/styles/authpage.module.scss";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useRef } from "react";
import { api } from "../services/api";
import axios from "axios";

export default function EditPage() {

  const navigate = useNavigate();

  const oldPass = useRef<HTMLInputElement>(null);
  const newPass = useRef<HTMLInputElement>(null);
  const newConf = useRef<HTMLInputElement>(null);

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
    try {
      e.preventDefault();
      const oldPassword = oldPass.current?.value;
      const newPassword = newPass.current?.value;
      const confPassword = newConf.current?.value;

      if (!(oldPassword && newPassword && confPassword)) {
        throw Error("Заполните все поля!");
      }

      if (newConf.current?.value != newPass.current?.value) {
        throw Error("Новый пароль не совпадает!");
      }


      api.post('/edit', { "oldPassword": oldPassword, "newPassword": newPassword })
        .then(_ => {
          showSuccess("Пароль успешно изменен!");
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
            <div className={s.main__title}>Изменить пароль:</div>

            <div className={s.main__content}>

              <div className={s.main__back} onClick={() => navigate('/profile')}>Назад</div>


              <form className={sForm.main__form} onSubmit={handleSubmit}>
                <input className={sForm.main__input} ref={oldPass} type="text" placeholder="Старый пароль" />
                <input className={sForm.main__input} ref={newPass} type="text" placeholder="Новый пароль" />
                <input className={sForm.main__input} ref={newConf} type="text" placeholder="Повторите новый пароль" />
                <input className={sForm.main__submit} type="submit" value="Изменить пароль" />
              </form>

            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
