import React, { useEffect, useState, useContext } from "react";
import Button from "../Button";
import TemporaryDrawer from "./drawer";
import "./styles.css";
import { IconButton } from "@mui/material";
import { Select, MenuItem, FormControl } from "@mui/material";
import { CurrencyContext } from "../../../context/CurrencyContext";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

function Header() {
  const { currency, setCurrency } = useContext(CurrencyContext);
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
    <div className="header">
      <a href="/">
        <h1>
          CryptoTracker<span style={{ color: "var(--blue)" }}>.</span>
        </h1>
      </a>
      <div className="links">
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={currency.name}
            onChange={handleCurrencyChange}
            sx={{
              height: "2.5rem",
              color: "var(--white)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--white)",
              },
              "& .MuiSvgIcon-root": {
                color: "var(--white)",
              },
              "&:hover": {
                "&& fieldset": {
                  borderColor: "#3a80e9",
                },
              },
            }}
          >
            <MenuItem value="usd">USD</MenuItem>
            <MenuItem value="eur">EUR</MenuItem>
            <MenuItem value="vnd">VND</MenuItem>
            <MenuItem value="inr">INR</MenuItem>
            <MenuItem value="gbp">GBP</MenuItem>
          </Select>
        </FormControl>
        <a href="/">
          <p className="link">Home</p>
        </a>
        <a href="/compare">
          <p className="link">Compare</p>
        </a>
        <a href="/watchlist">
          <p className="link">Watchlist</p>
        </a>
        <a href="/dashboard">
          <Button text={"dashboard"} />
        </a>
        <IconButton onClick={changeMode}>
          {darkMode ? <LightModeIcon style={{ color: "var(--blue)" }} /> : <DarkModeIcon style={{ color: "var(--blue)" }} />}
        </IconButton>
      </div>
      <div className="drawer-component">
        <TemporaryDrawer />
      </div>
    </div>
  );
}

export default Header;
