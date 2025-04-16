import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { GetIpfsUrlFromPinata } from "../utils";
import { ethers } from "ethers";

export default function Marketplace() {
    const sampleData = useMemo(() => [
        {
            name: "NFT#1",
            description: "First NFT",
            website: "http://axieinfinity.io",
            image: "https://gateway.pinata.cloud/ipfs/QmZfY1YBrWc57B8a9hzF1z9W7qWCV1Jb2N1ooz6t4APdMV",
            price: "0.03",
            currentlySelling: "True",
            address: "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
            tokenId: 1,
        },
        {
            name: "NFT#2",
            description: "Second NFT",
            website: "http://axieinfinity.io",
            image: "https://gateway.pinata.cloud/ipfs/QmZfY1YBrWc57B8a9hzF1z9W7qWCV1Jb2N1ooz6t4APdMV",
            price: "0.03",
            currentlySelling: "True",
            address: "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
            tokenId: 2,
        },
        {
            name: "NFT#3",
            description: "Third NFT",
            website: "http://axieinfinity.io",
            image: "https://gateway.pinata.cloud/ipfs/QmZfY1YBrWc57B8a9hzF1z9W7qWCV1Jb2N1ooz6t4APdMV",
            price: "0.03",
            currentlySelling: "True",
            address: "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
            tokenId: 3,
        },
        {
            name: "NFT#4",
            description: "Fourth NFT",
            website: "http://axieinfinity.io",
            image: "https://gateway.pinata.cloud/ipfs/QmZfY1YBrWc57B8a9hzF1z9W7qWCV1Jb2N1ooz6t4APdMV",
            price: "0.03",
            currentlySelling: "True",
            address: "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
            tokenId: 4,
        },
        {
            name: "NFT#5",
            description: "Fifth NFT",
            website: "http://axieinfinity.io",
            image: "https://gateway.pinata.cloud/ipfs/QmZfY1YBrWc57B8a9hzF1z9W7qWCV1Jb2N1ooz6t4APdMV",
            price: "0.03",
            currentlySelling: "True",
            address: "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
            tokenId: 5,
        },
        {
            name: "NFT#6",
            description: "Sixth NFT",
            website: "http://axieinfinity.io",
            image: "https://gateway.pinata.cloud/ipfs/QmZfY1YBrWc57B8a9hzF1z9W7qWCV1Jb2N1ooz6t4APdMV",
            price: "0.03",
            currentlySelling: "True",
            address: "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
            tokenId: 6,
        },
    ], []);

    const [data, setData] = useState(sampleData);
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        async function fetchNFTs() {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
                const transaction = await contract.getAllNFTs();

                if (!transaction || transaction.length === 0) {
                    console.log("No NFTs found on blockchain. Using sample data.");
                    setData(sampleData);
                    return;
                }

                const items = await Promise.all(transaction.map(async i => {
                    let tokenURI = await contract.tokenURI(i.tokenId);
                    tokenURI = GetIpfsUrlFromPinata(tokenURI);

                    let meta = await axios.get(tokenURI);
                    meta = meta.data;

                    let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

                    return {
                        price,
                        tokenId: i.tokenId.toNumber(),
                        seller: i.seller,
                        owner: i.owner,
                        image: meta.image,
                        name: meta.name,
                        description: meta.description,
                    };
                }));

                setData(items);
            } catch (error) {
                console.error("Error fetching NFTs from contract:", error);
                console.log("Falling back to sample data.");
                setData(sampleData);
            }
        }

        if (!dataFetched) {
            fetchNFTs();
            setDataFetched(true);
        }
    }, [dataFetched, sampleData]);

    return (
        <div className="bg-gray-900 min-h-screen">
            <Navbar />
            <div className="flex flex-col items-center mt-20 p-4">
                <h1 className="text-3xl font-bold text-white mb-8">Top NFTs</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
                    {data.map((value, index) => (
                        <NFTTile data={value} key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}