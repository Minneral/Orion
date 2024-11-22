import s from "../assets/styles/footer.module.scss"
import instagram from "../assets/icons/instagram.png"
import facebook from "../assets/icons/facebook.png"
import twitter from "../assets/icons/twitter.png"
import telegram from "../assets/icons/telegram.png"
import logo from "../assets/images/logo.png"

export default function Footer() {
    return (
        <footer className={s.footer}>
            <div className="container">
                <div className={s.footer__inner}>
                    <div className={s.footer__social}>
                        <a href="#"><img src={instagram} alt="instagram" /></a>
                        <a href="#"><img src={twitter} alt="twitter" /></a>
                        <a href="#"><img src={facebook} alt="facebook" /></a>
                        <a href="#"><img src={telegram} alt="telegram" /></a>
                    </div>

                    <div className={s.footer__nav}>
                        <a className={s.footer__navLink} href="#">Главная</a>
                        <a className={s.footer__navLink} href="#">FAQ</a>
                        <a className={s.footer__navLink} href="#">Поддержка</a>
                        <a className={s.footer__navLink} href="#">Контакты</a>
                    </div>


                    <div className={s.footer__copy}>
                        <div className={s.footer__copyTitle}>
                            Copyright 2024 &copy;
                        </div>

                        <div className={s.footer__copyMeta}>
                            <img src={logo} alt="logo" />
                            <span>Минск</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
