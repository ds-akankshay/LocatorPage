import * as React from "react";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

const PhotoSlider = (props: any) => {
  const { photoGallery, height, width } = props;  
  const photos = photoGallery.map((element:any) => (     
	<SplideSlide>
    <img height={height} width={width} src={element.image.url} />
	</SplideSlide>    
  ));
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Photo Slider</h2>
	  <Splide aria-label="Photo Slider">
          {photos}
      </Splide>
    </>
  );
};

export default PhotoSlider;