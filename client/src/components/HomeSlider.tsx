import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

import '../assets/styles/Swiper.scss';

import { EffectCoverflow, Navigation } from 'swiper/modules';
import { MovieSliderProps } from '../types/MovieSliderProps';

export default function HomeSlider(props: MovieSliderProps) {
    return (
        <>
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2,
                }}
                navigation={true}
                modules={[EffectCoverflow, Navigation]}
                className="homeSwiper"
            >
                {props.cards.map((card, index) => {
                    return <SwiperSlide key={index}>
                        {card}
                    </SwiperSlide>

                })}
            </Swiper>
        </>
    );
}
