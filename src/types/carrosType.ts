export interface GetCarros {
    id: string;
    name: string;
    model: string;
    ano: string;
    km: string;
    preco: string;
    city: string;
    whatsapp: string;
    images: ImageCar[];
    date: string;
    uid: string;
    descricao?: string
}
export interface ImageCar {
    name: string;
    uid: string;
    url: string;
}