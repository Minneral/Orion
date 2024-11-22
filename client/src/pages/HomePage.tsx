import HomeSlider from "../components/HomeSlider";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MovieSlider from "../components/MovieSlider";

import s from "../assets/styles/homepage.module.scss"
import FlagBtn from "../components/FlagBtn";

import fluent from "../assets/icons/fluent.png";
import videoPlayer from "../assets/icons/video-player.png";
import favorite from "../assets/icons/favorite.png";
import bookMark from "../assets/icons/bookmark.png";
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

import IMG from "../assets/images/img_1.jpg";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { MovieType } from "../types/Movie";

export default function Home() {

  // const OPTIONS: EmblaOptionsType = { loop: true }
  // const SLIDE_COUNT = 5
  // const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

  // const IMGS = [
  //   "https://homkin.ru/wp-content/uploads/2019/01/bissa-1024x712.jpg",
  //   "https://aquarium-fish-home.ru/wp-content/uploads/2019/08/s1200-3.jpg",
  //   "https://w.forfun.com/fetch/24/24481a9b3fb372e10b55ebed0db361fc.jpeg",
  //   "https://faunablog.ru/wp-content/uploads/2022/11/morskaya-cherepaha.jpg",
  //   "https://w.forfun.com/fetch/63/630ab88732f21964071be383456621a5.jpeg"
  // ]

  const navigate = useNavigate();
  const [filmCards, setFilmCards] = useState<JSX.Element[]>([]);
  const [seriesCards, setSeriesCards] = useState<JSX.Element[]>([]);
  const [cartoonCards, setCartoonCards] = useState<JSX.Element[]>([]);

  useEffect(() => {
    Array(10).fill(null).map(() => {
      // setFilmCards(prev => [...prev, <MovieCard id={1} imgUrl={IMG} type="movie" />]);
      setSeriesCards(prev => [...prev, <MovieCard id={1} imgUrl={IMG} type="series" access_level="Базовый"/>]);
      setCartoonCards(prev => [...prev, <MovieCard id={1} imgUrl={IMG} type="series" access_level="Базовый"/>]);
    });

    api.get('/movies')
      .then(response => response.data)
      .then(data => {
        let movies: MovieType[] = data['movies'];
        let movieCards = movies.map((movie: MovieType, index) =>
          <MovieCard
            key={index}
            id={movie.id}
            imgUrl={movie.banner_url}
            type="movie"
            access_level={movie.access_level}
          />
        );
        setFilmCards([...movieCards]);
      })



  }, []);



  return (
    <>
      <Header />
      <HomeSlider cards={filmCards} />
      <div className={s.main}>
        <div className="container">
          <div className={s.main__inner}>
            <div className={s.main__flags}>
              <FlagBtn title="Фильмы" imageUrl={fluent} callBack={() => navigate('/movies')} />
              <FlagBtn title="Сериалы" imageUrl={videoPlayer} callBack={() => navigate('/series')} />
              <FlagBtn title="Понравившиеся" imageUrl={favorite} callBack={() => navigate('/favorite')} />
              <FlagBtn title="Просмотренные" imageUrl={bookMark} callBack={() => navigate('/watched')} />
            </div>

            <div className={s.main__slider}>
              <div className={s.main__title}>
                Фильмы
              </div>
              <MovieSlider cards={filmCards} />
            </div>

            <div className={s.main__slider}>
              <div className={s.main__title}>
                Сериалы
              </div>
              <MovieSlider cards={seriesCards} />
            </div>

            <div className={s.main__slider}>
              <div className={s.main__title}>
                Мультфильмы
              </div>
              <MovieSlider cards={cartoonCards} />
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
