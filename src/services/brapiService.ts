export default async function obterCotacao(ticker: string) {
    const token = '7cNBdwS5P8EqD1SsRctziv';
    const url = `https://brapi.dev/api/v2/stocks/quote?symbols=${ticker}`

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (response.status === 404) return null;
        if (!response.ok) return null;

        const dados = await response.json();
        if (dados.results && dados.results.length > 0) {
            return dados.results[0];
        }

        return null;
    } catch (error) {
        console.log('Erro', error);
        return null;
    }
}
