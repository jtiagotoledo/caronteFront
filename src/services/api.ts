import axios from 'axios';

const api = axios.create({
    baseURL: 'https://caronte.solardev.dpdns.org/api',
    timeout: 10000,
});

export const buscarCotacao = async (ticker: string) => {
    try {
        const response = await api.get(`/cotacao/${ticker}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar cotação', error);
        throw error;
    }
}

export const buscarAtivo = async (termo: string) => {
    try {
        const response = await api.get(`/pesquisa/${termo}`);
        console.log('respostabuscaTicker', response.data);
        return response.data;
    } catch (error:any) {
    if (error.response && error.response.status === 404) {
        console.warn("Nenhum ativo encontrado para essa pesquisa.");
    } else {
        console.error("Erro na requisição:", error);
    }
}
}