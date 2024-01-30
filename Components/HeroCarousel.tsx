"use client"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel"
import Image from "next/image"

const HeroCarousel = () => {
  const heroImages = [
    { imgUrl: "/assets/images/hero-1.svg", alt: "smartwatch" },
    { imgUrl: "/assets/images/hero-2.svg", alt: "bag" },
    { imgUrl: "/assets/images/hero-3.svg", alt: "lamp" },
    { imgUrl: "/assets/images/hero-4.svg", alt: "air fryer" },
    { imgUrl: "/assets/images/hero-5.svg", alt: "chair" },
  ]
  return (
    <div className="hero-carousel">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={4000}
        showArrows={false}
        showStatus={false}
      >
        {heroImages.map((image) => (
          <Image
            src={image.imgUrl}
            className="object-contain"
            height={204}
            width={204}
            key={image.alt}
            alt={image.alt}
          />
        ))}
      </Carousel>
      <Image
        src="assets/icons/hand-drawn-arrow.svg"
        alt="arrow"
        width={170}
        height={170}
        className="max-xl:hidden absolute -left-[15%] bottom-0 z-0"
      />
    </div>
  )
}

export default HeroCarousel
