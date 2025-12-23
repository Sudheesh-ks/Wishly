import api from './api';

export interface Letter {
    _id?: string;
    childName: string;
    location: string;
    wishList: string;
    status: 'Nice' | 'Naughty' | 'Sorting';
    content?: string;
}

export const fetchLetters = async () => {
    const response = await api.get('/letters');
    return response.data;
};

export const createLetter = async (letter: Omit<Letter, '_id' | 'status'>) => {
    const response = await api.post('/letters', letter);
    return response.data;
};

export const updateLetterStatus = async (id: string, status: string) => {
    const response = await api.patch(`/letters/${id}/status`, { status });
    return response.data;
};
