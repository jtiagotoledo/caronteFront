export default async function obterCotacao(ticker: string) {
    const token = '7cNBdwS5P8EqD1SsRctziv';
    const url = `https://brapi.dev/api/v2/stocks/quote?symbols=${ticker}`

    try {
        const response = await fetch(url,{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        });
        const data = response.json();
        return data;
        
        
    } catch (error) {

    }
}
