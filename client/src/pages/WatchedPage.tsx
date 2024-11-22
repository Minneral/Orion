import Footer from "../components/Footer";
import Header from "../components/Header";

import s from "../assets/styles/watchedpage.module.scss";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { WatchedType } from "../types/WatchedType";
import MovieCard from "../components/MovieCard";
import { useNavigate } from "react-router-dom";

export default function WatchedPage() {

  const [movieCards, setMovieCards] = useState<JSX.Element[]>([]);
  const [seriesCards, setSeriesCards] = useState<JSX.Element[]>([]);
  const [current, setCurrent] = useState("Фильмы");
  const navigate = useNavigate();

  const handleCurrentChange = (e: React.MouseEvent<HTMLElement>) => {
    if (current != e.currentTarget.innerHTML && current == "Фильмы")
      setCurrent("Сериалы")
    else
      if (current == "Сериалы")
        setCurrent("Фильмы");
  }

  useEffect(() => {

    api.get('/watched').then(response => response.data)
      .then(data => {
        const watched: WatchedType[] = data.watched;

        const movies = watched.filter((item) => item.movie_id !== null);
        const series = watched.filter((item) => item.series_id !== null);

        const _movies = movies.map((item, index) => (
          item.movie_id ? <MovieCard key={index}
            id={item.movie_id}
            type="movie"
            imgUrl={item.banner_url} /> : null
        )).filter(item => item !== null)

        const _series = series.map((item, index) => (
          item.series_id ? <MovieCard key={index}
            id={item.series_id}
            type="series"
            imgUrl={item.banner_url} /> : null
        )).filter(item => item !== null)

        setMovieCards([..._movies]);
        setSeriesCards([..._series]);
      })

  }, [])

  return (
    <>
      <Header />
      <div className={s.main}>
        <div className="container">
          <div className={s.main__inner}>
            <div className={s.main__title}>Список просмотренных:</div>

            <div className={s.main__content}>
            <div className={s.main__back} onClick={() => navigate('/profile')}>Назад</div>

              <div className={s.main__select}>
                <span className={current == "Фильмы" ? s.active : ""} onClick={handleCurrentChange}>Фильмы</span>
                <span className={current == "Сериалы" ? s.active : ""} onClick={handleCurrentChange}>Сериалы</span>
              </div>

              <div className={s.main__list}>
                {
                  current == "Фильмы" ?
                    movieCards : seriesCards
                }
              </div>


            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
