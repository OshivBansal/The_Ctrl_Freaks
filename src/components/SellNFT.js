import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import MarketplaceJSON from "../Marketplace.json";
import { ethers } from "ethers";

export default function SellNFT() {
    const [formParams, updateFormParams] = useState({ name: '', description: '', price: '' });
    const [fileURL, setFileURL] = useState(null);
    const [message, updateMessage] = useState('');

    const disableButton = () => {
        const listButton = document.getElementById("list-button");
        listButton.disabled = true;
        listButton.classList.add("opacity-50", "cursor-not-allowed");
    };

    const enableButton = () => {
        const listButton = document.getElementById("list-button");
        listButton.disabled = false;
        listButton.classList.remove("opacity-50", "cursor-not-allowed");
    };

    const OnChangeFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            disableButton();
            updateMessage("Uploading image... Please don't click anything!");
            const response = await uploadFileToIPFS(file);
            if (response.success) {
                setFileURL(response.pinataURL);
                updateMessage("");
            }
        } catch (e) {
            console.error("Error during file upload:", e);
            updateMessage("Failed to upload image. Please try again.");
        } finally {
            enableButton();
        }
    };

    const uploadMetadataToIPFS = async () => {
        const { name, description, price } = formParams;
        if (!name || !description || !price || !fileURL) {
            updateMessage("Please fill all the fields!");
            return null;
        }

        const nftJSON = { name, description, price, image: fileURL };
        try {
            const response = await uploadJSONToIPFS(nftJSON);
            if (response.success) {
                return response.pinataURL;
            }
        } catch (e) {
            console.error("Error uploading JSON metadata:", e);
            updateMessage("Failed to upload metadata. Please try again.");
        }
        return null;
    };

    const listNFT = async (e) => {
        e.preventDefault();

        try {
            const metadataURL = await uploadMetadataToIPFS();
            if (!metadataURL) return;

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            disableButton();
            updateMessage("Uploading NFT... Please don't click anything!");

            const contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
            const price = ethers.utils.parseUnits(formParams.price, 'ether');
            const listingPrice = (await contract.getListPrice()).toString();

            const transaction = await contract.createToken(metadataURL, price, { value: listingPrice });
            await transaction.wait();

            alert("Successfully listed your NFT!");
            updateMessage("");
            updateFormParams({ name: '', description: '', price: '' });
            window.location.replace("/");
        } catch (e) {
            alert("Upload error: " + e.message);
            updateMessage("Failed to list NFT. Please try again.");
        } finally {
            enableButton();
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="flex justify-center items-center px-4 py-12">
                <form
                    className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-xl border border-gray-700"
                    onSubmit={listNFT}
                >
                    <h2 className="text-2xl font-bold text-center mb-6">
                        List Your NFT on the Marketplace
                    </h2>

                    <div className="mb-6">
                        <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-300">
                            NFT Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="e.g., Axie #4563"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={e => updateFormParams({ ...formParams, name: e.target.value })}
                            value={formParams.name}
                        />
                        <p className="text-xs text-gray-400 mt-1">Enter a unique name for your NFT.</p>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block mb-2 text-sm font-semibold text-gray-300">
                            NFT Description
                        </label>
                        <textarea
                            id="description"
                            placeholder="e.g., Axie Infinity Collection"
                            rows="4"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formParams.description}
                            onChange={e => updateFormParams({ ...formParams, description: e.target.value })}
                        />
                        <p className="text-xs text-gray-400 mt-1">Describe your NFT in detail.</p>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="price" className="block mb-2 text-sm font-semibold text-gray-300">
                            Price (in ETH)
                        </label>
                        <input
                            id="price"
                            type="number"
                            step="0.01"
                            placeholder="e.g., 0.01"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formParams.price}
                            onChange={e => updateFormParams({ ...formParams, price: e.target.value })}
                        />
                        <p className="text-xs text-gray-400 mt-1">Set the listing price for your NFT (minimum 0.01 ETH).</p>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="image" className="block mb-2 text-sm font-semibold text-gray-300">
                            Upload Image (500 KB)
                        </label>
                        <input
                            id="image"
                            type="file"
                            className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:hover:bg-blue-700 file:transition file:duration-200"
                            onChange={OnChangeFile}
                        />
                        <p className="text-xs text-gray-400 mt-1">Upload a high-quality image for your NFT.</p>
                    </div>

                    {message && (
                        <div className={`text-center font-medium mb-4 ${message.includes("Failed") ? "text-red-500" : "text-yellow-500"}`}>
                            {message}
                        </div>
                    )}

                    <button
                        id="list-button"
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 transition duration-200 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
                    >
                        List NFT
                    </button>
                </form>
            </div>
        </div>
    );
}