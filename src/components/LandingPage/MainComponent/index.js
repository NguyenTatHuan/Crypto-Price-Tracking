import React from "react";
import Button from "../../Common/Button";
import "./styles.css";
import gradient from "../../../assets/gradient.png";
import iphone from "../../../assets/iphone.png";
import { motion } from "framer-motion";

function MainComponent() {
    const shareData = {
        title: "CryptoTracker.",
        text: "CryptoDashboard using React JS in 2025.",
        url: "https://crypto-price-tracking-peach.vercel.app",
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareData.url);
                alert("Link copied to clipboard!");
            } catch (err) {
                alert("Unable to share or copy the link.");
                console.error(err);
            }
        }
    };

    return (
        <div className="main-flex">
            <div className="info-landing">
                <motion.h1
                    className="heading1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    Track Crypto
                </motion.h1>
                <motion.h1
                    className="heading2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.75, duration: 1 }}
                >
                    Real Time.
                </motion.h1>
                <motion.p
                    className="info-text"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    Track crypto through a public API in real time. Visit the dashboard to do so!
                </motion.p>
                <motion.div
                    className="btn-flex"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.25, duration: 0.75 }}
                >
                    <a href="/dashboard">
                        <Button text="Dashboard" />
                    </a>
                    <div onClick={handleShare}>
                        <Button text="Share" outlined />
                    </div>
                </motion.div>
            </div>
            <div className="gradient-div">
                <img src={gradient} className="gradient" alt="Background Gradient" />
                <motion.img
                    src={iphone}
                    className="iphone"
                    alt="iPhone"
                    initial={{ y: -10 }}
                    animate={{ y: 10 }}
                    transition={{
                        type: "smooth",
                        repeatType: "mirror",
                        duration: 2,
                        repeat: Infinity,
                    }}
                />
            </div>
        </div>
    );
}

export default MainComponent;
