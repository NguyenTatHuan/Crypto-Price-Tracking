import React, { useState, useEffect, useContext } from 'react';
import Header from "../components/Common/Header";
import SelectCoin from "../components/Prediction/Select";
import { CurrencyContext } from "../context/CurrencyContext";
import { get100Coins } from "../functions/get100Coins";
import LineChartPredict from "../components/Prediction/LineChart";
import Loader from "../components/Common/Loader";

function Prediction() {
    const { currency } = useContext(CurrencyContext);

    const [allCoins, setAllCoins] = useState([]);
    const [error, setError] = useState(false);
    const [days, setDays] = useState(30);
    const [crypto, setCrypto] = useState("bitcoin");
    const [loading, setLoading] = useState(false);
    const [predictions, setPredictions] = useState(null);

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                setLoading(true);
                const coins = await get100Coins(currency);
                setAllCoins(coins);
            } catch (err) {
                console.error("Error fetching coins:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchCoins();
    }, [currency]);

    useEffect(() => {
        if (allCoins.length > 0) {
            fetchPredictions();
        }
    }, [currency]);


    const handleDaysChange = (event) => {
        setDays(event.target.value);
        setPredictions(null);
    };

    const handleCoinChange = (event) => {
        setCrypto(event.target.value);
        setPredictions(null);
    };


    const fetchPredictions = async () => {
        try {
            setLoading(true);
            const response = await fetch("https://crypto-price-prediction-ttq0.onrender.com/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    coin_id: crypto,
                    days: days,
                    currency: currency?.name || "usd"
                }),
            });
            if (!response.ok) throw new Error("Failed to fetch predictions");
            const data = await response.json();
            setPredictions(data.predictions || {});
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            {loading && <Loader />}
            <SelectCoin
                allCoins={allCoins}
                crypto={crypto}
                onCoinChange={handleCoinChange}
                days={days}
                handleDaysChange={handleDaysChange}
                onSubmit={fetchPredictions}
            />
            {predictions && !loading && (
                <div className="chart-wrapper">
                    <LineChartPredict
                        predictData={{ coin_id: crypto, predictions }}
                        chartLoading={loading}
                        currency={currency}
                    />
                </div>
            )}
        </div>
    );
}

export default Prediction;
