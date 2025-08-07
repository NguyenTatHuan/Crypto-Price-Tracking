import React, { useEffect, useState, useCallback, startTransition } from "react";
import Info from "../components/CoinPage/Info";
import LineChart from "../components/CoinPage/LineChart";
import ToggleComponents from "../components/CoinPage/ToggleComponents";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import SelectCoins from "../components/ComparePage/SelectCoins";
import List from "../components/Dashboard/List";
import { get100Coins } from "../functions/get100Coins";
import { getCoinData } from "../functions/getCoinData";
import { getPrices } from "../functions/getPrices";
import { settingChartData } from "../functions/settingChartData";
import { settingCoinObject } from "../functions/settingCoinObject";

function Compare() {
    const [allCoins, setAllCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chartLoading, setChartLoading] = useState(false);

    const [crypto1, setCrypto1] = useState("bitcoin");
    const [crypto2, setCrypto2] = useState("ethereum");
    const [coin1Data, setCoin1Data] = useState({});
    const [coin2Data, setCoin2Data] = useState({});

    const [days, setDays] = useState(30);
    const [priceType, setPriceType] = useState("prices");
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            setLoading(true);
            const coins = await get100Coins();
            setAllCoins(coins);

            const [data1, data2] = await Promise.all([
                getCoinData(crypto1),
                getCoinData(crypto2),
            ]);

            if (!data1 || !data2) {
                console.error("One of the coin data is missing:", data1, data2);
                return;
            }

            settingCoinObject(data1, setCoin1Data);
            settingCoinObject(data2, setCoin2Data);

            await updateChartData(crypto1, crypto2, days, priceType);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        } finally {
            setLoading(false);
        }
    };

    const onCoinChange = async (e, isCoin2) => {
        const newCrypto = e.target.value;
        setLoading(true);

        try {
            if (isCoin2) {
                setCrypto2(newCrypto);
                const [data2, prices1, prices2] = await Promise.all([
                    getCoinData(newCrypto),
                    getPrices(crypto1, days, priceType),
                    getPrices(newCrypto, days, priceType),
                ]);
                settingCoinObject(data2, setCoin2Data);
                settingChartData(setChartData, prices1, prices2);
            } else {
                setCrypto1(newCrypto);
                const [data1, prices1, prices2] = await Promise.all([
                    getCoinData(newCrypto),
                    getPrices(newCrypto, days, priceType),
                    getPrices(crypto2, days, priceType),
                ]);
                settingCoinObject(data1, setCoin1Data);
                settingChartData(setChartData, prices1, prices2);
            }
        } catch (error) {
            console.error("Error changing coin:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateChartData = useCallback(async (crypto1, crypto2, days, priceType) => {
        setChartLoading(true);
        try {
            const [prices1, prices2] = await Promise.all([
                getPrices(crypto1, days, priceType),
                getPrices(crypto2, days, priceType),
            ]);
            startTransition(() => {
                settingChartData(setChartData, prices1, prices2);
            });
        } catch (error) {
            console.error("Error updating chart data:", error);
        } finally {
            setTimeout(() => setChartLoading(false), 300);
        }
    }, []);

    const handleDaysChange = async (e) => {
        const newDays = e.target.value;
        setDays(newDays);
        await updateChartData(crypto1, crypto2, newDays, priceType);
    };

    const handlePriceTypeChange = async (e) => {
        const newType = e.target.value;
        setPriceType(newType);
        await updateChartData(crypto1, crypto2, days, newType);
    };

    return (
        <div>
            <Header />
            {loading || !coin1Data?.id || !coin2Data?.id ? (
                <Loader />
            ) : (
                <>
                    <SelectCoins
                        allCoins={allCoins}
                        crypto1={crypto1}
                        crypto2={crypto2}
                        onCoinChange={onCoinChange}
                        days={days}
                        handleDaysChange={handleDaysChange}
                    />
                    <div className="grey-wrapper">
                        <List coin={coin1Data} />
                    </div>
                    <div className="grey-wrapper">
                        <List coin={coin2Data} />
                    </div>
                    <div className="grey-wrapper">
                        <ToggleComponents
                            priceType={priceType}
                            handlePriceTypeChange={handlePriceTypeChange}
                        />
                        <LineChart chartData={chartData} multiAxis={true} chartLoading={chartLoading} />
                    </div>
                    <Info title={coin1Data.name} desc={coin1Data.desc} />
                    <Info title={coin2Data.name} desc={coin2Data.desc} />
                </>
            )}
        </div>
    );
}

export default Compare;
