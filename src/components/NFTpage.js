import Navbar from "./Navbar";
import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";

export default function NFTPage() {
    const [message, updateMessage] = useState("");
    const location = useLocation();
    const { tokenId: paramTokenId } = useParams();
    const { image, price, tokenId: stateTokenId, name, description } = location.state || {};
    const tokenId = stateTokenId || paramTokenId;

    const buyNFT = async () => {
        try {
            if (!tokenId || !price) {
                updateMessage("Cannot buy NFT: Missing token ID or price.");
                return;
            }

            updateMessage("Processing your purchase... Please wait.");
            // Simulate a delay to mimic a real transaction
            await new Promise(resolve => setTimeout(resolve, 2000));
            updateMessage("Purchase successful! Enjoy your NFT!");
        } catch (error) {
            console.error("Error simulating buy:", error);
            updateMessage("Purchase simulation failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="flex flex-col items-center px-4 py-12 max-w-6xl mx-auto">
                {!location.state ? (
                    <div className="text-center">
                        <p className="text-xl text-gray-400">No NFT selected or invalid access.</p>
                        <p className="text-gray-400 mt-2">
                            Please select an NFT from the marketplace.
                        </p>
                        {message && (
                            <p className="text-red-500 mt-2">{message}</p>
                        )}
                    </div>
                ) : (
                    <div className="w-full max-w-md flex flex-col items-center gap-6">
                        {/* NFT Image */}
                        <div className="w-full">
                            <img
                                src={image || "https://via.placeholder.com/400x400?text=NFT+Image+Missing"}
                                alt={name || "NFT"}
                                className="w-full h-auto rounded-lg shadow-lg object-cover"
                            />
                        </div>

                        {/* NFT Details */}
                        <div className="w-full text-left">
                            <h2 className="text-2xl font-bold mb-2">{name || "Unnamed NFT"}</h2>
                            <p className="text-gray-300 mb-4">
                                <span className="font-semibold">Description:</span>{" "}
                                {description || "No description available"}
                            </p>
                            <p className="text-gray-300 mb-4">
                                <span className="font-semibold">Price:</span>{" "}
                                {price ? `${price} ETH` : "Not listed"}
                            </p>
                            <p className="text-gray-300 mb-4">
                                <span className="font-semibold">Token ID:</span>{" "}
                                {tokenId || "Unknown"}
                            </p>
                        </div>

                        {/* Buy Button */}
                        <button
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={buyNFT}
                            disabled={!tokenId || !price}
                        >
                            Buy this NFT
                        </button>

                        {/* Message */}
                        {message && (
                            <div
                                className={`mt-4 text-center font-medium ${
                                    message.includes("failed") ? "text-red-500" : "text-green-500"
                                }`}
                            >
                                {message}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}