import Footer from "../components/Footer";
import Header from "../components/Header";
import Cookies from "js-cookie";

import s from "../assets/styles/profilepage.module.scss";
import PanelBtn from "../components/PanelBtn";

import wallet_icon from "../assets/icons/wallet.png"
import heart_icon from "../assets/icons/favorite.png"
import settings_icon from "../assets/icons/settings.png"
import bookmark_icon from "../assets/icons/bookmark.png"

import { useAuth } from "../components/AuthProvider";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {

  const navigate = useNavigate();
  const user = useAuth();
  const [image, setImage] = useState('');

  const handleLogoutClick = () => {
    Cookies.remove('user');
    Cookies.remove('JWT');
    location.reload();
  }

  const handleAvatarClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result;
          if (typeof base64 === 'string') {
            api.post('/avatar', { "image": base64 })
              .then(_ => location.reload())
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  useEffect(() => {
    api.get('/avatar', { responseType: 'arraybuffer' })
      .then(response => {
        const base64 = btoa(
          new Uint8Array(response.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        setImage(`data:image/jpeg;base64,${base64}`);
      })
  }, [])

  return (
    <>
      <Header />
      <div className={s.main}>
        <div className="container">
          <div className={s.main__inner}>
            <div className={s.main__title}>Личный кабинет</div>

            <div className={s.main__content}>
              <div className={s.main__info}>
                <div className={s.main__user}>
                  <div className={s.main__avatar} onClick={handleAvatarClick}>
                    <img src={image} alt="avatar" />
                  </div>
                  <div className={s.main__userInfo}>
                    <div className={s.main__username}>{user?.username}</div>
                    <div className={s.main__userdata}>
                      <div className={s.main__userdataItem}>
                        <span>Аккаунт:</span>
                        <span>{user?.subscription_level}</span>
                      </div>
                      <div className={s.main__userdataItem}>
                        <span>Email:</span>
                        <span>{user?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={s.main__editprofile} onClick={() => navigate('/edit')}>
                  Изменить пароль
                </div>
              </div>

              <div className={s.main__panel}>
                <PanelBtn icon={wallet_icon} title="Управление подпиской" callback={() => navigate('/subscription')} grow={2} />
                <PanelBtn icon={bookmark_icon} title="Просмотрено" callback={() => navigate('/watched')} grow={1} />
                <PanelBtn icon={heart_icon} title="Понравившиеся" callback={() => navigate('/favorite')} grow={1} />
                <PanelBtn icon={settings_icon} title="Настройки" callback={() => navigate('/settings')} grow={1} />
              </div>

              <div className={s.main__exit} onClick={handleLogoutClick}>
                Выйти
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
