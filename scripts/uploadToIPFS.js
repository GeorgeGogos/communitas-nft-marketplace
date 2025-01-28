require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

async function uploadToIPFS(filePath) {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const options = {
        headers: {
            "pinata_api_key": process.env.PINATA_API_KEY,
            "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY,
        },
    };

    try {
        const response = await axios.post(url, formData, options);
        console.log("IPFS Hash:", response.data.IpfsHash);
    } catch (error) {
        console.error("Error uploading to IPFS:", error);
    }
}

uploadToIPFS(process.argv[2]);
