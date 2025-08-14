import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ToggleComponents({ priceType, handlePriceTypeChange }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "1.5rem",
            }}
        >
            <ToggleButtonGroup
                value={priceType}
                exclusive
                onChange={handlePriceTypeChange}
                sx={{
                    "& .MuiToggleButtonGroup-grouped": {
                        border: "1px solid var(--blue)",
                        color: "var(--blue)",
                        transition: "all 0.3s ease",
                        "&.Mui-selected": {
                            backgroundColor: "var(--blue)",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "var(--blue)",
                                opacity: 0.9,
                            },
                        },
                    },
                }}
            >
                <ToggleButton value="prices">Prices</ToggleButton>
                <ToggleButton value="market_caps">Market Cap</ToggleButton>
                <ToggleButton value="total_volumes">Total Volume</ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}
