import React, { useEffect, useState, useCallback, startTransition, useContext } from "react";
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
import { CurrencyContext } from "../context/CurrencyContext";

function Compare() {
    const { currency } = useContext(CurrencyContext);

    const [allCoins, setAllCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chartLoading, setChartLoading] = useState(false);
    const [isDataReady, setIsDataReady] = useState(false);
    const [error, setError] = useState(false);

    const [crypto1, setCrypto1] = useState("bitcoin");
    const [crypto2, setCrypto2] = useState("ethereum");
    const [coin1Data, setCoin1Data] = useState();
    const [coin2Data, setCoin2Data] = useState();

    const [days, setDays] = useState(30);
    const [priceType, setPriceType] = useState("prices");
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        getData();
    }, [currency]);

    const getData = async () => {
        try {
            setLoading(true);
            setIsDataReady(false);
            setError(false);

            const coins = await get100Coins(currency);
            setAllCoins(coins);

            const [data1, data2] = await Promise.all([
                getCoinData(crypto1),
                getCoinData(crypto2),
            ]);

            if (!data1 || !data2) {
                console.error("One of the coin data is missing:", data1, data2);
                setError(true);
                return;
            }

            settingCoinObject(data1, setCoin1Data, currency);
            settingCoinObject(data2, setCoin2Data, currency);

            const pricesLoaded = await updateChartData(
                crypto1,
                crypto2,
                days,
                priceType,
                data1?.name || crypto1,
                data2?.name || crypto2,
                false
            );

            if (pricesLoaded) {
                setIsDataReady(true);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error("Error fetching initial data:", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const onCoinChange = async (e, isCoin2) => {
        const newCrypto = e.target.value;
        setLoading(true);
        setIsDataReady(false);
        setError(false);

        try {
            if (isCoin2) {
                setCrypto2(newCrypto);
                const [data2, prices1, prices2] = await Promise.all([
                    getCoinData(newCrypto),
                    getPrices(crypto1, currency, days, priceType, setError),
                    getPrices(newCrypto, currency, days, priceType, setError),
                ]);

                if (!data2 || !prices1?.length || !prices2?.length) {
                    setError(true);
                    return;
                }

                settingCoinObject(data2, setCoin2Data, currency);
                settingChartData(
                    setChartData,
                    prices1,
                    prices2,
                    coin1Data?.name || crypto1,
                    data2?.name || newCrypto
                );
            } else {
                setCrypto1(newCrypto);
                const [data1, prices1, prices2] = await Promise.all([
                    getCoinData(newCrypto),
                    getPrices(newCrypto, currency, days, priceType, setError),
                    getPrices(crypto2, currency, days, priceType, setError),
                ]);

                if (!data1 || !prices1?.length || !prices2?.length) {
                    setError(true);
                    return;
                }

                settingCoinObject(data1, setCoin1Data, currency);
                settingChartData(
                    setChartData,
                    prices1,
                    prices2,
                    data1?.name || newCrypto,
                    coin2Data?.name || crypto2
                );
            }
            setIsDataReady(true);
        } catch (error) {
            console.error("Error changing coin:", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const updateChartData = useCallback(
        async (crypto1, crypto2, days, priceType, label1, label2, isOnlyChart = true) => {
            if (isOnlyChart) {
                setChartLoading(true);
            } else {
                setLoading(true);
            }

            setError(false);

            try {
                const [prices1, prices2] = await Promise.all([
                    getPrices(crypto1, currency, days, priceType, setError),
                    getPrices(crypto2, currency, days, priceType, setError),
                ]);

                if (!prices1?.length || !prices2?.length) {
                    console.error("Price data missing");
                    setError(true);
                    return false;
                }

                startTransition(() => {
                    settingChartData(
                        setChartData,
                        prices1,
                        prices2,
                        label1 || coin1Data?.name || crypto1,
                        label2 || coin2Data?.name || crypto2
                    );
                });
                return true;
            } catch (error) {
                console.error("Error updating chart data:", error);
                setError(true);
                return false;
            } finally {
                if (isOnlyChart) {
                    setTimeout(() => setChartLoading(false), 300);
                } else {
                    setLoading(false);
                }
            }
        },
        [coin1Data, coin2Data, currency]
    );

    const handleDaysChange = async (e) => {
        const newDays = Number(e.target.value);
        setDays(newDays);
        await updateChartData(
            crypto1,
            crypto2,
            newDays,
            priceType,
            coin1Data?.name,
            coin2Data?.name,
            true
        );
    };

    const handlePriceTypeChange = async (e) => {
        const newType = e.target.value;
        setPriceType(newType);
        await updateChartData(
            crypto1,
            crypto2,
            days,
            newType,
            coin1Data?.name,
            coin2Data?.name,
            true
        );
    };

    return (
        <div>
            <Header />
            {loading || !isDataReady ? (
                <Loader />
            ) : error ? (
                <div style={{ color: "red", textAlign: "center", marginTop: 20 }}>
                    Error loading data. Please try agian later!
                </div>
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
                        <LineChart
                            chartData={chartData}
                            multiAxis={true}
                            chartLoading={chartLoading}
                            currency={currency}
                        />
                    </div>
                    <Info title={coin1Data?.name} desc={coin1Data?.desc} />
                    <Info title={coin2Data?.name} desc={coin2Data?.desc} />
                </>
            )}
        </div>
    );
}

export default Compare;
