import api from './api';

export interface Gift {
    _id?: string;
    title: string;
    image: string;
    stock?: number;
}

export const fetchGifts = async () => {
    const response = await api.get('/gifts');
    return response.data;
};

export const createGift = async (gift: Gift) => {
    const response = await api.post('/gifts', gift);
    return response.data;
};
