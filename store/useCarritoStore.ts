import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Carrito {
    id: string;
    numbers: number;
    price: number;
    name: string;
}

const initialCarritoStore: Carrito | null = null

interface RaffleStoreState {
    carrito: Carrito | null;
    setCarrito: (item: Carrito) => void;
}

const useCarritoStore = create<RaffleStoreState>()(
    persist(
        (set) => ({
            // Estado inicial
            carrito: initialCarritoStore,

            // Acciones básicas
            setCarrito: (e) => set({ carrito: e }),
            
        }),
        {
            name: 'raffle-storage', // clave para el localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useCarritoStore;