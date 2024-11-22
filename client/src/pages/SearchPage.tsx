import Footer from "../components/Footer";
import Header from "../components/Header";

import s from "../assets/styles/watchedpage.module.scss";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import MovieCard from "../components/MovieCard";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../services/useQuerry";
import { MovieType } from "../types/Movie";

export default function SearchPage() {

  const [movieCards, setMovieCards] = useState<JSX.Element[]>([]);
  const [seriesCards, setSeriesCards] = useState<JSX.Element[]>([]);
  const navigate = useNavigate();
  const querry = useQuery();

  useEffect(() => {

    api.post('/search', { "search": querry.get('value') }).then(response => response.data)
      .then(data => {
        const movies: MovieType[] = data.movies;
        const series = data.series;

        const _movies = movies.map((item, index) => (
          <MovieCard key={index}
            id={item.id}
            type="movie"
            imgUrl={item.banner_url} />
        )).filter(item => item !== null)

        // const _series = series.map((item, index) => (
        //   item.series_id ? <MovieCard key={index}
        //     id={item.series_id}
        //     type="series"
        //     imgUrl={item.banner_url} /> : null
        // )).filter(item => item !== null)

        setMovieCards([..._movies]);

        // setSeriesCards([..._series]);
      })
      .catch(_ => {
        setMovieCards([]);
        setSeriesCards([]);
      })

  }, [querry.get('value')])

  return (
    <>
      <Header />
      <div className={s.main}>
        <div className="container">
          <div className={s.main__inner}>
            <div className={s.main__title}>Результат поиска по запросу: {querry.get('value')}</div>

            <div className={s.main__content}>

              <div className={s.main__back} onClick={() => navigate('/profile')}>Назад</div>

              <div className={s.main__list}>
                {
                  movieCards
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
