export interface ItemPesquisa {
    ticker: string;
    nome: string;
    logoUrl: string;
}

export async function obterCotacao(ticker: string) {
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

export async function pesquisaPorTicker(tickerSearch: string) {
    if (!tickerSearch || tickerSearch.trim() === '') {
        return [];
    }
    const url = `https://brapi.dev/api/v2/tickers?search=${tickerSearch.trim()}`

    try {
        const response = await fetch(url)
        if (!response.ok) return [];
        const data = await response.json();

        const itensFormatados: ItemPesquisa[] = (data.results || []).map((item: any) => ({
            ticker: item.symbol,
            nome: item.longName || item.name,
            logoUrl: item.logoUrl,
        }));

        return itensFormatados;

    } catch (error) {
        console.log('Erro', error);
        return [];
    }
}
