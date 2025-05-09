'use client';

import { Banner } from "@/components/Banner";
import { RaffleSection } from "@/components/RaffleSection";
import { GalleryItem, Rifa, TicketPackage } from "@/interface";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

interface FormData {
    email: string;
    id: string;
}


export const HomeView = () => {

    const [rifas, setRifas] = useState<Rifa[]>([]);
    const [rifaMasReciente, setRifaMasReciente] = useState<Rifa | null>(null)
    const [formData, setFormData] = useState<FormData>({
        email: '',
        id: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [accept, setAccept] = useState<string | null>(null);

    useEffect(() => {
        const fetchTalonarios = async () => {
            try {
                const response = await axios.get('https://rifas.accumed.cloud/api/allTalonarios');

                setRifaMasReciente(response.data.data);
                setFormData({
                    ...formData,
                    id: response.data.data.id
                })
            } catch (err: any) {
                console.log(err.message);
            }
        };
        fetchTalonarios();
    }, []);

    useEffect(() => {
        if (rifas.length > 0) {
            const masReciente = [...rifas].sort((a, b) => {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            })[0];
            setRifaMasReciente(masReciente);
        }
    }, [rifas]);

    console.log(rifaMasReciente);

    const percentage = useMemo(() => {
        if (!rifaMasReciente?.array_numbers) {
            return { freePercentage: 0, occupiedPercentage: 0 };
        }

        const totalNumbers = rifaMasReciente.array_numbers.length;
        const freeCount = rifaMasReciente.array_numbers.filter(
            num => num.status === 'free'
        ).length;

        return {
            freePercentage: parseFloat(((freeCount / totalNumbers) * 100).toFixed(2)),
            occupiedPercentage: parseFloat((100 - (freeCount / totalNumbers) * 100).toFixed(2))
        };
    }, [rifaMasReciente]);

    const getSafeGallery = (galleryData: string | GalleryItem[] | undefined): GalleryItem[] => {
        try {
            if (!galleryData) return [];
            if (Array.isArray(galleryData)) return galleryData;
            if (typeof galleryData === 'string') return JSON.parse(galleryData);
            return [];
        } catch (error) {
            console.error('Error parsing gallery data:', error);
            return [];
        }
    };

    const gallery: GalleryItem[] = getSafeGallery(rifaMasReciente?.gallery);
    const precios: TicketPackage[] = [
        {
            quantity: 5,
            price: Number(rifaMasReciente?.price || 0) * 5
        },
        {
            quantity: 10,
            price: Number(rifaMasReciente?.price || 0) * 10
        },
        {
            quantity: 15,
            price: Number(rifaMasReciente?.price || 0) * 15
        },
        {
            quantity: 20,
            price: Number(rifaMasReciente?.price || 0) * 20
        },
        {
            quantity: 25,
            price: Number(rifaMasReciente?.price || 0) * 25
        },
        {
            quantity: 30,
            price: Number(rifaMasReciente?.price || 0) * 30
        },
    ];

    const handleSendEmail = async () => {
        console.log('Email', formData);
        if (!formData.email) {
            setError('Por favor, ingresa un correo electrónico.');
            setTimeout(() => {
                setError(null);
            }, 3000);
            return;
        }

        try {

            const response = await fetch('https://rifas.accumed.cloud/api/consultNumbers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: formData.id,
                    email: formData.email
                })
            });
        
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la solicitud');
            }
        
            const data = await response.json();
            console.log("Números consultados:", data);

        } catch (error) {
            console.error('Error al procesar:', error);
            let errorMessage = 'Ocurrió un error';

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            alert(`error: ${errorMessage}`);
        }

    }

    return (
        <>
            <Banner />
            <div className="max-w-6xl mx-auto px-4 py-16">
                <h1 className="text-5xl font-bold text-center mb-8 uppercase">¿Cómo Participar?</h1>

                <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-12">
                    {/* Paso 1 */}
                    <div className="flex-1 flex flex-col text-center bg-white shadow-lg rounded-lg p-6 min-h-[400px]">
                        <span className="font-bold text-9xl text-[#ccc]">1</span>
                        <div className="flex-grow flex items-center">
                            <p className="text-sm md:text-lg font-medium text-justify text-red-500 w-full">
                                Elige el paquete con la cantidad de números que prefieras. <span className="font-semibold text-primary">¡Recuerda!</span> Cuantos más números tengas, mayores serán tus posibilidades de ganar.
                            </p>
                        </div>
                    </div>

                    {/* Paso 2 */}
                    <div className="flex-1 flex flex-col text-center bg-white shadow-lg rounded-lg p-6 min-h-[400px]">
                        <span className="font-bold text-9xl text-[#ccc]">2</span>
                        <div className="flex-grow flex items-center">
                            <p className="text-sm md:text-lg font-medium text-justify text-red-500 w-full">
                                Al hacer tu elección serás dirigido a una página donde podrás completar tus datos personales y realizar el pago a nuestra cuenta bancaria.
                            </p>
                        </div>
                    </div>

                    {/* Paso 3 */}
                    <div className="flex-1 flex flex-col text-center bg-white shadow-lg rounded-lg p-6 min-h-[400px]">
                        <span className="font-bold text-9xl text-[#ccc]">3</span>
                        <div className="flex-grow flex items-center">
                            <p className="text-sm md:text-lg font-medium text-justify text-red-500 w-full">
                                Una vez confirmado el pago tu número te enviaremos de forma aleatoria al correo electrónico que registraste (revisa tu bandeja de spam o correo con no deseado).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className='bg-[#c2272d] py-8 px-4'>
                    <h1 className='text-center font-bold text-5xl md:text-6xl text-white'>
                        CONCURSA Y GANA!
                    </h1>
                </div>
            </div>
            <RaffleSection id={rifaMasReciente?.id || ''} gallery={gallery} precios={precios} percentage={percentage.occupiedPercentage} description={rifaMasReciente?.description || ''} title={rifaMasReciente?.title || ''} />

            <div className="max-w-7xl mx-auto px-4 pb-16">
                <h1 className='text-center font-bold text-3xl md:text-4xl text-primary'>
                    CONSULTA TUS NÚMEROS
                </h1>
                <div className="text-center mt-4 text-[#b91419]">
                    <p>
                        Ya hiciste tu compra?<br />
                        Consulta tus números aquí con tu correo electrónico.
                    </p>
                </div>
                <input
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white text-black block m-auto w-full max-w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-8"
                    placeholder="Ingrese su email"
                    required
                />
                {error && (
                    <div className="text-red-500 text-center mt-2">
                        {error}
                    </div>
                )}
                <button
                    className="bg-[#b91419] rounded-lg text-center flex cursor-pointer px-6 py-3 mx-auto mt-8"
                    onClick={handleSendEmail}
                >
                    <p className="font-bold text-white text-lg">consultar</p>
                </button>
            </div>

        </>
    );
}