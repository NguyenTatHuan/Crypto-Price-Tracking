export const getCoinData = (id, setError) => {
    return fetch(
        `https://api.coingecko.com/api/v3/coins/${id}`,
        {
            method: 'GET',
            headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-5Z2sfJRjG47odmmRR7kwFgVc' }
        }
    )
        .then(response => response.json())
        .then((data) => data)
        .catch((error) => {
            console.log("ERROR>>>", error.message);
            if (setError) {
                setError(true);
            }
            return null;
        });
};
