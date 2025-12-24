import api from './api';

export interface Letter {
    _id?: string;
    childName: string;
    location: string;
    wishList?: string;
    gift?: {
        _id: string;
        title: string;
        image: string;
    };
    giftId?: string;
    status: 'Nice' | 'Naughty' | 'Sorting';
    isPacked: boolean;
    content?: string;
    popularity?: number;
}

export const fetchLetters = async (params?: { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc'; status?: string }) => {
    const response = await api.get('/letters', { params });
    return response.data;
};

export const createLetter = async (letter: Omit<Letter, '_id' | 'status' | 'isPacked'>) => {
    const response = await api.post('/letters', letter);
    return response.data;
};

export const updateLetterStatus = async (id: string, status: string) => {
    const response = await api.patch(`/letters/${id}/status`, { status });
    return response.data;
};

export const updateLetterPackedStatus = async (id: string, isPacked: boolean) => {
    const response = await api.patch(`/letters/${id}/packed`, { isPacked });
    return response.data;
};
