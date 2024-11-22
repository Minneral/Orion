import { MovieCardProps } from '../types/MovieCardProps'

import s from "../assets/styles/moviecard.module.scss";
import { useNavigate } from 'react-router-dom';

export default function MovieCard(props: MovieCardProps) {

  const navigate = useNavigate();
  const handleClick = () => {
    if (props.type == "movie") {
      navigate('/movie?id=' + props.id);
      location.reload();
    }
    else {
      navigate('/serie?id=' + props.id)
    }
  }

  return (
    <div className={s.card} onClick={handleClick} data-level={props.access_level}>
      <div className={s.card__inner}>
        <img src={props.imgUrl} alt="banner" />
      </div>
    </div>
  )
}
