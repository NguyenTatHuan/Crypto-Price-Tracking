import React, { useState, useEffect, useContext } from "react";
import "./styles.css";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { convertNumber } from "../../../functions/convertNumber";
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { saveItemToWatchlist } from "../../../functions/saveItemToWatchlist";
import StarIcon from "@mui/icons-material/Star";
import { removeItemToWatchlist } from "../../../functions/removeItemToWatchlist";
import { CurrencyContext } from "../../../context/CurrencyContext";

function List({ coin, delay }) {
    const { currency } = useContext(CurrencyContext);
    const [isCoinAdded, setIsCoinAdded] = useState(false);

    useEffect(() => {
        const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
        setIsCoinAdded(watchlist.includes(coin.id));
    }, [coin.id]);

    const handleWatchlistToggle = (e) => {
        e.stopPropagation();
        if (isCoinAdded) {
            removeItemToWatchlist(e, coin.id, setIsCoinAdded);
        } else {
            saveItemToWatchlist(e, coin.id);
            setIsCoinAdded(true);
        }
    };

    return (
        <motion.tr
            className="list-row"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: delay }}
            style={{ cursor: "pointer" }}
            onClick={() => (window.location.href = `/coin/${coin.id}`)}
        >
            <Tooltip title="Coin Image">
                <td className="td-img">
                    <img
                        src={coin.image}
                        className="coin-image coin-image-td"
                        alt={coin.name}
                    />
                </td>
            </Tooltip>

            <Tooltip title="Coin Info" placement="bottom-start">
                <td className="td-info">
                    <div className="info-flex">
                        <p className="coin-symbol td-p">{coin.symbol}</p>
                        <p className="coin-name td-p">{coin.name}</p>
                    </div>
                </td>
            </Tooltip>

            <Tooltip title="Coin Price Percentage In 24hrs" placement="bottom-start">
                <td>
                    <div className="chip-flex">
                        <div className={`price-chip ${coin.price_change_percentage_24h < 0 ? "red" : ""}`}>
                            {coin.price_change_percentage_24h.toFixed(2)}%
                        </div>
                        <div className={`chip-icon td-chip-icon ${coin.price_change_percentage_24h < 0 ? "red" : ""}`}>
                            {coin.price_change_percentage_24h < 0 ? (
                                <TrendingDownRoundedIcon />
                            ) : (
                                <TrendingUpRoundedIcon />
                            )}
                        </div>
                    </div>
                </td>
            </Tooltip>

            <Tooltip
                title={`Coin Price in ${currency.name.toUpperCase()}`}
                placement="bottom-end"
            >
                <td
                    className={
                        coin.price_change_percentage_24h < 0
                            ? "current-price-red td-current-price"
                            : "current-price td-current-price"
                    }
                >
                    {currency.symbol}
                    {coin.current_price.toLocaleString()}
                </td>
            </Tooltip>

            <Tooltip
                title={`Coin Total Volume (${currency.name.toUpperCase()})`}
                placement="bottom-end"
            >
                <td className="coin-name td-totalVolume">
                    {currency.symbol}
                    {coin.total_volume.toLocaleString()}
                </td>
            </Tooltip>

            <Tooltip
                title={`Coin Market Capital (${currency.name.toUpperCase()})`}
                placement="bottom-end"
            >
                <td className="coin-name td-marketCap">
                    {currency.symbol}
                    {coin.market_cap.toLocaleString()}
                </td>
            </Tooltip>

            <td className="coin-name mobile">
                {currency.symbol}
                {convertNumber(coin.market_cap)}
            </td>

            <td
                className={`watchlist-icon ${coin.price_change_percentage_24h < 0 ? "watchlist-icon-red" : ""}`}
                onClick={handleWatchlistToggle}
            >
                {isCoinAdded ? <StarIcon /> : <StarOutlineIcon />}
            </td>
        </motion.tr>
    );
}

export default List;
