import React, { useState, useEffect, useContext } from "react";
import "./styles.css";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { motion } from "framer-motion";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { saveItemToWatchlist } from "../../../functions/saveItemToWatchlist";
import { removeItemToWatchlist } from "../../../functions/removeItemToWatchlist";
import { CurrencyContext } from "../../../context/CurrencyContext";
import { Link } from "react-router-dom";

function Grid({ coin, delay }) {
    const { currency } = useContext(CurrencyContext);
    const [isCoinAdded, setIsCoinAdded] = useState(false);

    useEffect(() => {
        const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
        setIsCoinAdded(watchlist.includes(coin.id));
    }, [coin.id]);

    const handleWatchlistToggle = (e) => {
        e.preventDefault();
        if (isCoinAdded) {
            removeItemToWatchlist(e, coin.id, setIsCoinAdded);
        } else {
            saveItemToWatchlist(e, coin.id);
            setIsCoinAdded(true);
        }
    };

    return (
        <Link to={`/coin/${coin.id}`}>
            <motion.div
                className={`grid ${coin.price_change_percentage_24h < 0 ? "grid-red" : ""}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: delay }}
            >
                <div className="img-flex">
                    <img src={coin.image} alt={coin.name} className="coin-image" />
                    <div className="icon-flex">
                        <div className="info-flex">
                            <p className="coin-symbol">{coin.symbol}</p>
                            <p className="coin-name">{coin.name}</p>
                        </div>
                        <div
                            className={`watchlist-icon ${coin.price_change_percentage_24h < 0 ? "watchlist-icon-red" : ""}`}
                            onClick={handleWatchlistToggle}
                        >
                            {isCoinAdded ? <StarIcon /> : <StarOutlineIcon />}
                        </div>
                    </div>
                </div>

                <div className="chip-flex">
                    <div className={`price-chip ${coin.price_change_percentage_24h < 0 ? "red" : ""}`}>
                        {coin.price_change_percentage_24h.toFixed(2)}%
                    </div>
                    <div className={`chip-icon ${coin.price_change_percentage_24h < 0 ? "red" : ""}`}>
                        {coin.price_change_percentage_24h < 0 ? (
                            <TrendingDownRoundedIcon />
                        ) : (
                            <TrendingUpRoundedIcon />
                        )}
                    </div>
                </div>

                <p className={coin.price_change_percentage_24h < 0 ? "current-price-red" : "current-price"}>
                    {currency.symbol}
                    {coin.current_price.toLocaleString()}
                </p>

                <p className="coin-name">
                    Total Volume: {currency.symbol}{coin.total_volume.toLocaleString()}
                </p>
                <p className="coin-name">
                    Market Capital: {currency.symbol}
                    {coin.market_cap.toLocaleString()}
                </p>
            </motion.div>
        </Link>
    );
}

export default Grid;
