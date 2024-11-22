import Footer from "../components/Footer";
// import Header from "../components/Header";

import s from "../assets/styles/notfound.module.scss";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* <Header /> */}
      <main className={s.main}>
        <h1>Ошибка 404</h1>
        <h3 onClick={() => navigate('/')}>На главную</h3>
      </main>
      <Footer />
    </>
  )
}
