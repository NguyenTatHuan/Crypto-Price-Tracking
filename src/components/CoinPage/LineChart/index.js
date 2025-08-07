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
    Legend
);

function LineChart({ chartData, multiAxis, chartLoading }) {
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
                display: !!multiAxis,
            },
        },
        scales: {
            crypto1: {
                type: "linear",
                position: "left",
                ticks: {
                    beginAtZero: true,
                    callback: (value) => convertNumber(value),
                },
            },
            ...(multiAxis && {
                crypto2: {
                    type: "linear",
                    position: "right",
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: (value) => convertNumber(value),
                    },
                },
            }),
            x: {
                type: "category",
            },
        },
    };

    return (
        <div className={`chart-container ${chartLoading ? "loading" : ""}`}>
            <Line data={chartData} options={options} />
        </div>
    );
}

export default LineChart;
