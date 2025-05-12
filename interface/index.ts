export interface NumberItem {
    id: number;
    participant: string;
    winner: boolean;
    status: "free" | "reserved" | "paid" | string; // Puedes ampliar los posibles estados
}

export interface GalleryItem {
    id: string;
    name: string;
    url: string;
}

export interface Rifa {
    id: string;
    title: string;
    imageUrl: string;
    user_id: string;
    price: string;
    numbers: number;
    array_numbers: NumberItem[];
    description: string;
    status: number;
    gallery: string | GalleryItem[]; // Puede venir como string JSON o como array parseado
    endDate: string;
    winner: string;
    confession: string | null;
    created_at: string;
    updated_at: string;
    participants: number;
}

// Interface para la respuesta completa del API (si es un array de Rifa)
export interface ApiRifasResponse {
    data: Rifa[];
    success: boolean;
    message?: string;
}

export interface TicketPackage {
    quantity: number;
    price: number;
  };