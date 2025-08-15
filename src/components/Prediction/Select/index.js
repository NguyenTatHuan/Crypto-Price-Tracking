import { MenuItem, Select, Button } from "@mui/material";
import SelectDay from "../SelectDay";
import "./styles.css";

function SelectCoin({ allCoins, crypto, onCoinChange, days, handleDaysChange, onSubmit }) {
    const style = {
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
    };

    return (
        <div className="select-coins-div">
            <div className="select-flex">
                <p>Crypto</p>
                <Select
                    value={crypto}
                    onChange={(e) => onCoinChange(e)}
                    sx={style}
                >
                    {allCoins.map((coin, i) => (
                        <MenuItem value={coin.id} key={i}>
                            {coin.name}
                        </MenuItem>
                    ))}
                </Select>
            </div>
            <SelectDay
                days={days}
                handleDaysChange={handleDaysChange}
                noPTag={true}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={onSubmit}
                sx={{ width: "150px", height: "2.5rem" }}
            >
                Predict
            </Button>
        </div>
    );
}

export default SelectCoin;
