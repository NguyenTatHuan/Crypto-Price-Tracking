import React, { useEffect, useState, useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import Search from "../components/Dashboard/Search";
import TabsComponent from "../components/Dashboard/Tabs";
import PaginationComponent from "../components/Dashboard/Pagination";
import TopButton from "../components/Common/TopButton";
import Footer from "../components/Common/Footer/footer";

function Dashboard() {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [paginatedCoins, setPaginatedCoins] = useState([]);

    const { currency } = useContext(CurrencyContext);

    useEffect(() => {
        getData();
    }, [currency]);

    const getData = () => {
        setLoading(true);
        fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&order=market_cap_desc&per_page=100&page=1&sparkline=false`, {
            method: 'GET',
            headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-5Z2sfJRjG47odmmRR7kwFgVc' }
        })
            .then(response => response.json())
            .then(data => {
                setCoins(data);
                setPaginatedCoins(data.slice(0, 10));
            })
            .catch(error => console.log("ERROR:", error.message))
            .finally(() => setLoading(false));
    };

    const handleChange = (e) => {
        setSearch(e.target.value);
        console.log(e.target.value);
    };

    var filteredCoins = coins.filter(
        (coin) =>
            coin.name.toLowerCase().includes(search.trim().toLowerCase()) ||
            coin.symbol.toLowerCase().includes(search.trim().toLowerCase())
    );

    const handlePageChange = (event, value) => {
        setPage(value);
        var initialCount = (value - 1) * 10;
        setPaginatedCoins(coins.slice(initialCount, initialCount + 10));
    };

    return (
        <>
            <Header />
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Search search={search} handleChange={handleChange} />
                    <TabsComponent
                        coins={search ? filteredCoins : paginatedCoins}
                        setSearch={setSearch}
                    />
                    {!search && (
                        <PaginationComponent
                            page={page}
                            handlePageChange={handlePageChange}
                        />
                    )}
                </>
            )}
            <TopButton />
            <Footer />
        </>
    );
}

export default Dashboard;
