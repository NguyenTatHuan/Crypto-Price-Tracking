import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

import { convertNumber } from "../../../functions/convertNumber";
import "./styles.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function LineChartPredict({ predictData, currency, chartLoading }) {
    const symbol = currency?.symbol || "$";

    const labels = Object.keys(predictData.predictions);
    const dataValues = Object.values(predictData.predictions);

    const chartData = {
        labels,
        datasets: [
            {
                label: `${predictData.coin_name}`,
                data: dataValues,
                borderColor: "#3a80e9",
                backgroundColor: "rgba(58, 128, 233,0.1)",
                tension: 0.25,
                fill: true,
                pointRadius: 0,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        animation: {
            duration: 1000,
            easing: "easeInOutQuad",
        },
        interaction: {
            mode: "index",
            intersect: false,
        },
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) {
                            label += symbol + convertNumber(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                type: "linear",
                beginAtZero: false,
                title: {
                    display: true,
                    text: "Price",
                },
                ticks: {
                    callback: (value) => symbol + convertNumber(value),
                },
            },
            x: {
                type: "category",
                title: {
                    display: false
                },
                ticks: {
                    display: false
                }
            },
        },
    };

    return (
        <div className={`chart-container ${chartLoading ? "loading" : ""}`}>
            <Line data={chartData} options={options} />
        </div>
    );
}

export default LineChartPredict;
