import s from "../assets/styles/panelbtn.module.scss";
import { PanelBtnProps } from "../types/PanelBtnProps";

export default function PanelBtn(props: PanelBtnProps) {
    return (
        <div className={s.button} onClick={props.callback} style={{
            flexGrow: props.grow
        }}>
            <img src={props.icon} alt="icon" className={s.icon} />

            <div className={s.title}>{props.title}</div>
        </div>
    )
}
