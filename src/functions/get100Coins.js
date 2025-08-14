export const get100Coins = (currency) => {
    return fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
        {
            method: 'GET',
            headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-5Z2sfJRjG47odmmRR7kwFgVc' }
        }
    )
        .then(response => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.log("ERROR>>>", error.message);
            return [];
        });
};
