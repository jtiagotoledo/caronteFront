import axios from 'axios';

const api = axios.create({
    baseURL: 'https://caronte.solardev.dpdns.org/api',
    timeout: 10000,
});

export const buscarCotacao = async (ticker: string) => {
    try {
        const response = await api.get(`/cotacao/${ticker}`);
        console.log('respostabuscaTicker', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar cotação', error);
        throw error;
    }
}