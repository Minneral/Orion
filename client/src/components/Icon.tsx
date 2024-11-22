import Icons from "../assets/icons/sprite.svg";

const Icon = ({ name, color, size } : {name: string, color: string, size: number} ) => (
  <svg className={`icon icon-${name}`} fill={color} width={size} height={size}>
    <use xlinkHref={`${Icons}#svg_${name}`} />
  </svg>
);

export default Icon;