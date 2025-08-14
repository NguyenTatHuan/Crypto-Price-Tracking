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
    Legend
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

function LineChart({ chartData, multiAxis, chartLoading, currency }) {
    const symbol = currency?.symbol || "$";

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
            crypto1: {
                type: "linear",
                position: "left",
                title: {
                    display: true,
                    text: chartData.datasets?.[0]?.label || "Crypto 1",
                },
                ticks: {
                    beginAtZero: true,
                    callback: (value) => symbol + convertNumber(value),
                },
            },
            ...(multiAxis && {
                crypto2: {
                    type: "linear",
                    position: "right",
                    grid: {
                        drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: chartData.datasets?.[1]?.label || "Crypto 2",
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: (value) => symbol + convertNumber(value),
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
