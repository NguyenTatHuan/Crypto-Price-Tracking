import React, { useEffect, useState, useContext } from "react";
import Drawer from "@mui/material/Drawer";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { IconButton, Switch, Select, MenuItem, FormControl } from "@mui/material";
import { CurrencyContext } from "../../../context/CurrencyContext";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function TemporaryDrawer() {
    const { currency, setCurrency } = useContext(CurrencyContext);
    const [open, setOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

    useEffect(() => {
        if (localStorage.getItem("theme") === "dark") {
            setDark();
        } else {
            setLight();
        }
    }, []);

    const changeMode = () => {
        if (localStorage.getItem("theme") !== "dark") {
            setDark();
        } else {
            setLight();
        }
        setDarkMode(!darkMode);
    };

    const setDark = () => {
        localStorage.setItem("theme", "dark");
        document.documentElement.setAttribute("data-theme", "dark");
    };

    const setLight = () => {
        localStorage.setItem("theme", "light");
        document.documentElement.setAttribute("data-theme", "light");
    };

    const handleCurrencyChange = (e) => {
        const value = e.target.value;
        const symbols = {
            usd: "$",
            eur: "€",
            vnd: "₫",
            inr: "₹",
            gbp: "£"
        };
        setCurrency({ name: value, symbol: symbols[value] || "" });
    };

    return (
        <div>
            <IconButton onClick={changeMode}>
                {darkMode ? <LightModeIcon style={{ color: "var(--blue)" }} /> : <DarkModeIcon style={{ color: "var(--blue)" }} />}
            </IconButton>
            <IconButton onClick={() => setOpen(true)}>
                <MenuRoundedIcon className="link" />
            </IconButton>
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <div className="drawer-div">
                    <a href="/">
                        <p className="link">Home</p>
                    </a>
                    <a href="/compare">
                        <p className="link">Compare</p>
                    </a>
                    <a href="/watchlist">
                        <p className="link">Watchlist</p>
                    </a>
                    <a href="/prediction">
                        <p className="link">Prediction</p>
                    </a>
                    <a href="/dashboard">
                        <p className="link">Dashboard</p>
                    </a>
                    <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                        <Select value={currency.name} onChange={handleCurrencyChange}>
                            <MenuItem value="usd">USD</MenuItem>
                            <MenuItem value="eur">EUR</MenuItem>
                            <MenuItem value="vnd">VND</MenuItem>
                            <MenuItem value="inr">INR</MenuItem>
                            <MenuItem value="gbp">GBP</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </Drawer>
        </div>
    );
}