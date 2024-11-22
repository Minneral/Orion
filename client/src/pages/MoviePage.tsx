import Footer from "../components/Footer";
import Header from "../components/Header";

import s from "../assets/styles/moviepage.module.scss"

import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useQuery } from "../services/useQuerry";
import { useNavigate } from "react-router-dom";
import { MovieType } from "../types/Movie";
import Icon from "../components/Icon";
import { ReviewType } from "../types/ReviewType";
import { Range, getTrackBackground } from 'react-range'
import MovieCard from "../components/MovieCard";

const STEP = 1;
const MIN = 1;
const MAX = 10;

export default function MoviePage() {

  const [movieCards, setMovieCards] = useState<JSX.Element[]>([]);
  const [movie, setMovie] = useState<MovieType>();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [firstPlay, setFirstPlay] = useState<boolean>(false);
  const querry = useQuery();
  const navigate = useNavigate();
  const [values, setValues] = useState([1]);

  const handlePlay = () => {
    if (!firstPlay) {
      setFirstPlay(true);

      api.post('/watched', {
        "type": "movie",
        "id": querry.get('id')
      })
    }
  }

  const handleFavoriteClick = () => {
    setIsFavorite(prev => !prev);
    api.post('/review', {
      "type": "movie",
      "id": querry.get('id'),
      "isFavorite": String(!isFavorite),
      "rating": values[0]
    })
  }

  const handleChangeRange = (rating: number) => {
    api.post('/review', {
      "type": "movie",
      "id": querry.get('id'),
      "isFavorite": String(isFavorite),
      "rating": rating
    })
  }

  useEffect(() => {
    let id = querry.get("id");

    if (!id)
      navigate('/');

    api.get('/movies/' + id)
      .then(response => response.data)
      .then(data => {
        let movieInfo: MovieType = data['movie'];
        if (movieInfo) {
          setMovie(movieInfo);
        }
      })

    api.get('/movies')
      .then(response => response.data)
      .then(data => {
        let movies: MovieType[] = data['movies'];
        let movieCards = movies
          .filter(movie => movie.id !== Number(querry.get('id')))
          .map((movie: MovieType, index) =>
            <MovieCard key={index}
              id={movie.id}
              imgUrl={movie.banner_url}
              type="movie"
            />
          );
        setMovieCards([...movieCards.slice(0, 6)]);
      });


    api.get('/review')
      .then(response => response.data)
      .then(data => {
        let reviews: ReviewType[] = data["reviews"];

        let hasReview = reviews.some(review => (review['movie_id'] == Number(querry.get('id'))) && review.isFavorite);
        setIsFavorite(hasReview);

        reviews.map((item) => {
          if (item.movie_id == Number(querry.get('id'))) {
            if (item.rating) {
              setValues([item.rating]);
            }
            else {
              setValues([1]);
            }
          }
        })
      })

  }, [])

  return (
    <>
      <Header />
      <div className={s.main}>
        <div className="container">
          <div className={s.main__inner}>
            <div className={s.main__movie}>
              <div className={s.main__info}>
                <img src={movie?.title_url} alt="banner" />
                <div className={s.main__flags}>
                  <span>2023</span>
                  <span>Боевик</span>
                  <span>2:30</span>
                  <span>16+</span>
                </div>

                <div className={s.main__description}>
                  {movie?.description}
                </div>

                <div className={s.main__director}>
                  Режиссер: <span>{movie?.director}</span>
                </div>

                <div className={s.main__reaction}>
                  <div className={s.main__trailer}>Трейлер</div>

                  <div className={s.main__setfavorite} onClick={handleFavoriteClick}>
                    {
                      isFavorite ?
                        <Icon name="heart" color="red" size={32} />
                        :
                        <Icon name="heart" color="white" size={32} />
                    }
                  </div>
                </div>

                <div className={s.main__rating}>
                  <div className={s.main__ratingTitle}>Поставьте оценку</div>
                  <div className={s.main__rates}>
                    {
                      Array(10).fill(null).map((_, index) => <span key={index} className={values[0] == (index + 1) ? s.active : ''}>{index + 1}</span>)
                    }
                  </div>
                  <div className={s.main__range}>
                    <Range
                      values={values}
                      step={STEP}
                      min={MIN}
                      max={MAX}
                      onChange={(values) => {
                        setValues(values);
                        handleChangeRange(values[0]);
                      }

                      }
                      renderTrack={({ props, children }) => (
                        <div
                          onMouseDown={props.onMouseDown}
                          onTouchStart={props.onTouchStart}
                          style={{
                            ...props.style,
                            height: '36px',
                            display: 'flex',
                            width: '100%'
                          }}
                        >
                          <div
                            ref={props.ref}
                            style={{
                              height: '5px',
                              width: '100%',
                              borderRadius: '4px',
                              background: getTrackBackground({
                                values,
                                colors: ['#FF2C78', '#727272'],
                                min: MIN,
                                max: MAX,
                              }),
                              alignSelf: 'center'
                            }}
                          >
                            {children}
                          </div>
                        </div>
                      )}
                      renderThumb={({ props, isDragged }) => (
                        <div
                          {...props}
                          style={{
                            ...props.style,
                            outline: 'none',
                            height: '18px',
                            width: '18px',
                            borderRadius: '50%',
                            backgroundColor: '#FFF',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0px 2px 6px #AAA'
                          }}
                        >
                          <div
                            style={{
                              height: '9px',
                              width: '9px',
                              borderRadius: '50%',
                              backgroundColor: isDragged ? '#FF2C78' : '#727272'
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                  {/* <output style={{ marginTop: '30px' }}>{values[0].toFixed(1)}</output> */}

                </div>

              </div>


              <div className={s.main__player}>
                {/* <VideoPlayer /> */}
                <video controls={true} onPlay={handlePlay}>
                  <source src="http://127.0.0.1:5000/video" />
                </video>
              </div>
            </div>

            <div className={s.relevant}>
              <div className={s.relevant__title}>Похожие</div>

              <div className={s.relevant__list}>
                {
                  movieCards.map((card) => (card))
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
