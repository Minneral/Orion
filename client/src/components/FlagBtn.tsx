import { FlagBtnProps } from "../types/FlagBtnProps";

import s from "../assets/styles/flagbtn.module.scss";

export default function FlagBtn(props: FlagBtnProps) {
    return (
        <div className={s.button} onClick={props.callBack}>
            <img src={props.imageUrl} alt="icon" />
            <span>{props.title}</span>
        </div>
    )
}
