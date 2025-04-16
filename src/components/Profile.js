import Navbar from "./Navbar";
import { useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState, useEffect } from "react";
import NFTTile from "./NFTTile";

export default function Profile() {
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("0x");
    const [totalPrice, updateTotalPrice] = useState("0");

    const params = useParams();
    const tokenId = params.tokenId;

    async function getNFTData(tokenId) {
        const ethers = require("ethers");
        let sumPrice = 0;
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const addr = await signer.getAddress();

            const contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
            const transaction = await contract.getMyNFTs();

            const items = await Promise.all(transaction.map(async i => {
                const tokenURI = await contract.tokenURI(i.tokenId);
                let meta = await axios.get(tokenURI);
                meta = meta.data;

                let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
                let item = {
                    price,
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.image,
                    name: meta.name,
                    description: meta.description,
                };
                sumPrice += Number(price);
                return item;
            }));

            updateData(items);
            updateFetched(true);
            updateAddress(addr);
            updateTotalPrice(sumPrice.toPrecision(3));
        } catch (error) {
            console.error("Error fetching NFT data:", error);
            updateData([]);
            updateFetched(true);
        }
    }

    useEffect(() => {
        if (!dataFetched) {
            getNFTData(tokenId);
        }
    }, [dataFetched, tokenId]);

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <Navbar />
            <div className="flex flex-col items-center px-4 py-12 max-w-7xl mx-auto">
                {/* Wallet Address Section */}
                <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-center mb-4">Wallet Address</h2>
                    <p className="text-lg text-center break-all">{address}</p>
                </div>

                {/* Stats Section */}
                <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6 mb-8 flex flex-col md:flex-row justify-around text-center">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-xl font-bold">No. of NFTs</h2>
                        <p className="text-2xl">{data.length}</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Total Value</h2>
                        <p className="text-2xl">{totalPrice} ETH</p>
                    </div>
                </div>

                {/* NFTs Section */}
                <div className="w-full">
                    <h2 className="text-3xl font-bold text-center mb-6">Your NFTs</h2>
                    {data.length === 0 ? (
                        <p className="text-xl text-center">
                            Oops, No NFT data to display (Are you logged in?)
                        </p>
                    ) : (
                        <div className="flex justify-center flex-wrap gap-6">
                            {data.map((value, index) => (
                                <NFTTile data={value} key={index} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}