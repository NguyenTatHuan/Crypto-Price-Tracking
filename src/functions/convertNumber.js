export const convertNumber = (number) => {
    if (typeof number !== "number") return number;

    const abs = Math.abs(number);
    let formatted;

    if (abs >= 1e12) {
        formatted = (number / 1e12).toFixed(2) + "T";
    } else if (abs >= 1e9) {
        formatted = (number / 1e9).toFixed(2) + "B";
    } else if (abs >= 1e6) {
        formatted = (number / 1e6).toFixed(2) + "M";
    } else if (abs >= 1e3) {
        formatted = (number / 1e3).toFixed(2) + "K";
    } else {
        formatted = number.toString();
    }

    return formatted;
};
