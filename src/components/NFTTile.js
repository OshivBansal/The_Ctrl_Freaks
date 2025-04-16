import { Link } from "react-router-dom";

export default function NFTTile({ data }) {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 w-64 flex flex-col items-center text-white border border-gray-700">
            <img
                src={data.image}
                alt={data.name || "NFT"}
                className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-bold mb-2">{data.name || "Unnamed NFT"}</h3>
            <p className="text-gray-300 mb-4">
                <span className="font-semibold">Price:</span>{" "}
                {data.price ? `${data.price} ETH` : "Not listed"}
            </p>
            <Link
                to={`/nftpage/${data.tokenId}`}
                state={{
                    image: data.image,
                    price: data.price,
                    tokenId: data.tokenId,
                    name: data.name,
                    description: data.description
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
                View Details
            </Link>
        </div>
    );
}