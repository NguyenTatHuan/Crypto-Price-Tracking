export const getPrices = (id, currency, days, priceType, setError) => {
    return fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency.name}&days=${days}&interval=daily`,
        {
            method: 'GET',
            headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-5Z2sfJRjG47odmmRR7kwFgVc' }
        }
    )
        .then(response => response.json())
        .then(data => {
            if (!data) return [];
            if (priceType === "market_caps") {
                return data.market_caps || [];
            } else if (priceType === "total_volumes") {
                return data.total_volumes || [];
            } else {
                return data.prices || [];
            }
        })
        .catch(e => {
            console.log("ERROR>>>", e.message);
            if (setError) setError(true);
            return [];
        });
};