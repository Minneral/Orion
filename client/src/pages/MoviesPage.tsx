import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Select from 'react-select';
import { api } from "../services/api";

import s from "../assets/styles/moviespage.module.scss";
import MovieCard from "../components/MovieCard";
import { MovieType } from "../types/Movie";

export default function MoviesPage() {

  const [genreOptions, setGenreOptions] = useState<{ value: string; label: string; }[]>([]);
  const [yearOptions, setYearOptions] = useState<{ value: string; label: string; }[]>([]);

  const [selectedYears, setSelectedYears] = useState<string>();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const [movieCards, setMovieCards] = useState<JSX.Element[]>([]);

  const handleSubmit = () => {
    console.log(selectedGenres, selectedYears);

    api.post('/filter', { "date": selectedYears, "genres": selectedGenres.join(', ') })
      .then(res => res.data)
      .then(data => {
        const cards: MovieType[] = data.movies;

        const _movies = cards.map((item, index) => {
          console.log(item)
          return (
            <MovieCard key={index}
              id={item.id}
              type="movie"
              imgUrl={item.banner_url}
              access_level={item.access_level}
            />
          );
        })

        setMovieCards(_movies);
      })
  }

  useEffect(() => {
    api.get('/genres')
      .then(res => res.data)
      .then(data => {
        const genres = data['genres'];
        const genreOptions = genres.map((genre: string, _: number) => {
          return { value: genre, label: genre };
        });
        setGenreOptions([...genreOptions]);
      })

    const years = Array.from({ length: 101 }, (_, i) => 2024 - i);
    const _yearOptions = years.map(year => ({ value: year.toString(), label: year.toString() }));
    setYearOptions(_yearOptions);
  }, [])

  useEffect(() => {

  }, [selectedGenres, selectedYears])



  return (
    <>
      <Header />

      <main className={s.main}>
        <div className="container">
          <div className={s.main__inner}>
            <div className={s.main__title}>Фильмы</div>
            <div className={s.main__subtitle}>Мы подобрали для вас тысячи фильмов и учтем ваши пожелания при поиске</div>

            <div className={s.main__filters}>
              <Select
                className={s.main__select}
                classNamePrefix="select"
                isClearable={true}
                isMulti={true}
                placeholder="Жанр"
                isSearchable={true}
                onChange={(options) => setSelectedGenres(options.map(option => option.value))}
                name="color"
                options={genreOptions}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: 'neutral90',
                    primary: 'neutral70',
                  },
                })}
              />

              <Select
                className={s.main__select}
                classNamePrefix="select"
                isClearable={true}
                placeholder="Год выхода"
                isSearchable={true}
                isMulti={false}
                onChange={(selectedOption) => setSelectedYears(selectedOption ? selectedOption.value : '')}
                name="color"
                options={yearOptions}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: 'neutral90',
                    primary: 'neutral70',
                  },
                })}
              />

              <button className={s.main__submit} onClick={handleSubmit}>Найти</button>

            </div>
            <div className={s.main__content}>
              <div className={s.main__contentItem}>
                <div className={s.main__contentTitle}>Результат поиска</div>
                <div className={s.main__contentList}>
                  {movieCards}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
