import Footer from "../components/Footer";
import Header from "../components/Header";

import s from "../assets/styles/welcomepage.module.scss";

import introductionImg from "../assets/images/introduction.png";
import benefitUnitsImg from "../assets/images/units.png";
import benefitADImg from "../assets/images/no_AD.png";
import benefitPremiumsImg from "../assets/images/premium_content.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function WelcomePage() {
  const [username, setUsername] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get('user')) {
      navigate('/');
    }
  }, [])

  return (
    <>
      <Header />

      <div className={s.introduction}>
        <div className="container">
          <div className={s.introduction__inner}>
            <div className={s.introduction__left}>
              <div className={s.introduction__title}>Ваш личный кинотеатр</div>
              <div className={s.introduction__subtitle}>Все в одном месте</div>
              <div className={s.introduction__signup}>

                <div className={s.introduction__readyTitle}>Готовы смотреть? Укажите номер телефона для регистрации</div>

                <div className={s.introduction__ready}>
                  <form onSubmit={() => navigate('/signup?username=' + username)}>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Введите номер телефона" />
                    <button className={s.introduction__readyBtn} type="submit">Смотреть ►</button>
                  </form>
                </div>
              </div>
            </div>
            <div className={s.introduction__right}>
              <img src={introductionImg} alt="introduction" />
            </div>
          </div>
        </div>
      </div>

      <div className={s.benefits}>
        <div className="container">
          <div className={s.benefits__inner}>
            <div className={s.benefits__list}>

              <div className={s.benefits__item}>
                <div className={s.benefits__itemDescription}>
                  <div className={s.benefits__itemTitle}>Смотри где угодно</div>
                  <div className={s.benefits__itemSubTitle}>Смотри фильмы и сериалы на любых устройствах: ноутбуке, телефоне, телевизоре</div>
                </div>
                <div className={s.benefits__itemImg}>
                  <img src={benefitUnitsImg} alt="benefit" />
                </div>
              </div>


              {/* <div className={s.benefits__item}>
                <div className={s.benefits__itemDescription}>
                  <div className={s.benefits__itemTitle}>Скачивай и смотри без интернета</div>
                  <div className={s.benefits__itemSubTitle}>Доступно в премиум</div>
                </div>
                <div className={s.benefits__itemImg}>
                  <img src={benefitDownloadsImg} alt="benefit" />
                </div>
              </div> */}


              <div className={s.benefits__item}>
                <div className={s.benefits__itemDescription}>
                  <div className={s.benefits__itemTitle}>Премиум контент</div>
                  <div className={s.benefits__itemSubTitle}>Получите доступ к расширенной библиотеке контента</div>
                </div>
                <div className={s.benefits__itemImg}>
                  <img src={benefitPremiumsImg} alt="benefit" />
                </div>
              </div>

              <div className={s.benefits__item}>
                <div className={s.benefits__itemDescription}>
                  <div className={s.benefits__itemTitle}>Отсутствие рекламы</div>
                  <div className={s.benefits__itemSubTitle}>Вас не будут отвлекать от просмотра</div>
                </div>
                <div className={s.benefits__itemImg}>
                  <img src={benefitADImg} alt="benefit" />
                </div>
              </div>


            </div>

            <a className={s.benefits__subscription} href="/signup">Получить премиум</a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
