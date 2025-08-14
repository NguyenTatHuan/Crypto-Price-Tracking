import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Info from "../components/CoinPage/Info";
import LineChart from "../components/CoinPage/LineChart";
import SelectDays from "../components/CoinPage/SelectDays";
import ToggleComponents from "../components/CoinPage/ToggleComponents";
import Button from "../components/Common/Button";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import List from "../components/Dashboard/List";
import { getCoinData } from "../functions/getCoinData";
import { getPrices } from "../functions/getPrices";
import { settingChartData } from "../functions/settingChartData";
import { settingCoinObject } from "../functions/settingCoinObject";
import { CurrencyContext } from "../context/CurrencyContext";

function Coin() {
    const { id } = useParams();
    const { currency } = useContext(CurrencyContext);

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [coin, setCoin] = useState({});
    const [days, setDays] = useState(30);
    const [priceType, setPriceType] = useState("prices");
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [chartLoading, setChartLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchCoinData();
        }
    }, [id, currency]);

    const fetchCoinData = async () => {
        setLoading(true);
        const coinData = await getCoinData(id, setError);
        if (coinData) {
            settingCoinObject(coinData, setCoin, currency);
            await updateChartData(days, priceType, coinData.name);
            setLoading(false);
        }
    };

    const updateChartData = async (
        daysParam = days,
        priceTypeParam = priceType,
        coinName = coin.name
    ) => {
        setChartLoading(true);
        const prices = await getPrices(id, currency, daysParam, priceTypeParam, setError);
        if (prices) {
            settingChartData(setChartData, prices, null, coinName);
        }
        setChartLoading(false);
    };

    const handleDaysChange = async (event) => {
        const newDays = event.target.value;
        setDays(newDays);
        await updateChartData(newDays, priceType, coin.name);
    };

    const handlePriceTypeChange = async (event) => {
        const newPriceType = event.target.value;
        setPriceType(newPriceType);
        await updateChartData(days, newPriceType, coin.name);
    };

    return (
        <>
            <Header />
            {!error && !loading && coin.id ? (
                <>
                    <div className="grey-wrapper">
                        <List coin={coin} delay={0.5} />
                    </div>

                    <div className="grey-wrapper">
                        <SelectDays handleDaysChange={handleDaysChange} days={days} />
                        <ToggleComponents
                            priceType={priceType}
                            handlePriceTypeChange={handlePriceTypeChange}
                        />
                        <LineChart
                            chartData={chartData}
                            chartLoading={chartLoading}
                            multiAxis={false}
                            currency={currency}
                        />
                    </div>

                    <Info title={coin.name} desc={coin.desc} />
                </>
            ) : error ? (
                <div>
                    <h1 style={{ textAlign: "center" }}>
                        Sorry, Couldn't find the coin you're looking for
                    </h1>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            margin: "2rem",
                        }}
                    >
                        <a href="/dashboard">
                            <Button text="Dashboard" />
                        </a>
                    </div>
                </div>
            ) : (
                <Loader />
            )}
        </>
    );
}

export default Coin;
