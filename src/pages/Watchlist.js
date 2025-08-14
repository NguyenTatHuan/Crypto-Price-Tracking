import React, { useEffect, useState, useContext, useMemo } from "react";
import Button from "../components/Common/Button";
import Header from "../components/Common/Header";
import TabsComponent from "../components/Dashboard/Tabs";
import { get100Coins } from "../functions/get100Coins";
import { CurrencyContext } from "../context/CurrencyContext";

function Watchlist() {
    const [coins, setCoins] = useState([]);
    const { currency } = useContext(CurrencyContext);

    const watchlist = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("watchlist")) || [];
        } catch {
            return [];
        }
    }, []);

    useEffect(() => {
        if (watchlist) {
            getData();
        }
    }, [currency, watchlist]);

    const getData = async () => {
        const allCoins = await get100Coins(currency);
        if (allCoins) {
            setCoins(allCoins.filter((coin) => watchlist.includes(coin.id)));
        }
    };

    return (
        <div>
            <Header />
            {watchlist?.length > 0 ? (
                <TabsComponent coins={coins} />
            ) : (
                <div>
                    <h1 style={{ textAlign: "center" }}>
                        Sorry, No Items In The Watchlist.
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
            )}
        </div>
    );
}

export default Watchlist;