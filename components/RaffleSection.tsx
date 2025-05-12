'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { ProgressBar } from './ProgressBarProps';
import { GalleryItem, TicketPackage } from '@/interface';
import useCarritoStore from '@/store/useCarritoStore';
import { useRouter } from 'next/navigation';

interface RaffleSectionProps {
  gallery: GalleryItem[];
  precios: TicketPackage[];
  percentage: number;
  description: string;
  title: string;
  id: string;
  price: number;
}

export const RaffleSection = ({ gallery, precios, percentage, description, title, id, price }: RaffleSectionProps) => {
  const router = useRouter();
  const { setCarrito } = useCarritoStore();
  const [quantity, setQuantity] = useState<number>(1);

  const handleCarrito = (price: number, numbers: number) => {
    setCarrito({ id, price, numbers, name: title });
    router.push('/checkout');
  };

  const handleQuantityChange = (value: number) => {
    const newValue = quantity + value;
    setQuantity(newValue < 1 ? 1 : newValue);
  };

  const handleBuy = () => {
    const priceMulti = price * quantity; 
    const numbers = quantity;
    handleCarrito(priceMulti, numbers);
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Carrusel de imágenes - Lado izquierdo */}
        <div className="w-full md:w-2/5 px-4 md:p-0">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            className="h-64 md:h-[475px] overflow-hidden"
          >
            {gallery.map((image) => (
              <SwiperSlide key={image.id}>
                <div className="relative w-full h-full bg-gray-200">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Contenido de la rifa - Lado derecho */}
        <div className="w-full md:w-3/5 px-4 md:p-0 flex flex-col justify-start">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center text-[#b91419]">
            {title}
          </h2>
          <div
            className="prose text-xl text-justify"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
      <div className='my-8 px-4 md:p-0'>
        <p className="mb-4 font-semibold text-black text-center text-xl">
          ¡Los números son limitados! Asegura el tuyo y participa por este premio increíble.
        </p>
      </div>
      <div className="mt-8 mb-16 px-4 md:p-0">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {precios.map((pkg, index) => (
            <div key={index} className="bg-[#b91419] rounded-lg text-center flex cursor-pointer" onClick={() => handleCarrito(pkg.price, pkg.quantity)}>
              <div className='flex-3 p-2'>
                <p className="font-bold text-white text-lg pt-[0.2rem]">
                  {pkg.quantity} Tickets
                </p>
              </div>
              <div className='flex-1 p-2 bg-white w-full h-full rounded-r-lg'>
                <p className='text-center text-red-600 font-bold text-2xl'>
                  ${pkg.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Controles de cantidad */}
      <div className="mt-4 px-4 md:p-0 mb-16 flex flex-col items-center justify-center gap-4">
        <h1 className='text-xl text-center font-bold'>
            ¿MÁS NÚMEROS?<br />
            <span className='text-lg font-normal '>
              Agrega la cantidad de números que desees.
            </span>
        </h1>
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={() => handleQuantityChange(-1)}
            className="bg-[#b91419] text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold cursor-pointer"
            aria-label="Reducir cantidad"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              setQuantity(value < 1 ? 1 : value);
            }}
            className="w-20 text-center border border-[#b91419] rounded-lg py-2 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#b91419] focus:border-transparent appearance-none"
          />
          <button 
            onClick={() => handleQuantityChange(1)}
            className="bg-[#b91419] text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold cursor-pointer"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
        
        {/* Botón de comprar */}
        <button
          onClick={handleBuy}
          className="bg-[#b91419] hover:bg-[#9a1216] text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300"
        >
          Comprar ahora
        </button>
      </div>
      
      <div className="mt-4 px-4 md:p-0">
        <ProgressBar
          percentage={percentage}
          color="bg-[#d5af03]"
          bgColor="transparent"
          height={30}
        />
      </div>
    </div>
  );
};