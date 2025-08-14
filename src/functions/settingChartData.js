import { gettingDate } from "./getDate";

export const settingChartData = (
    setChartData,
    prices1,
    prices2 = null,
    label1 = "Crypto 1",
    label2 = "Crypto 2"
) => {
    const labels = prices1?.map((data) => gettingDate(data[0]));

    const dataset1 = {
        label: label1,
        data: prices1?.map((data) => data[1]),
        borderWidth: 1,
        fill: !prices2,
        backgroundColor: "rgba(58, 128, 233,0.1)",
        tension: 0.25,
        borderColor: "#3a80e9",
        pointRadius: 0,
        yAxisID: "crypto1",
    };

    let datasets = [dataset1];

    if (prices2) {
        datasets.push({
            label: label2,
            data: prices2?.map((data) => data[1]),
            borderWidth: 1,
            fill: false,
            tension: 0.25,
            borderColor: "#61c96f",
            pointRadius: 0,
            yAxisID: "crypto2",
        });
    }

    setChartData({ labels, datasets });
};
