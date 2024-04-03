require('dotenv').config();
const express = require('express');
const cors = require('cors')
const logger = require('morgan');
const axios = require('axios');
const Moralis = require('moralis')

const app = express();
const port = 3001;
const headers = {
    "Authorization": process.env.AUTHORIZATION,
    "Content-Type": "application/json"
};

// Middleware to give proper CORS permission to browser requests
app.use(cors())
app.use(logger('dev'))

// Middleware to handle request bodies
app.use(express.json());

// Middleware for URL validation
app.use((req, res, next) => {
    const url = req.originalUrl.substring(6); // Temporary hack to make this work with the Fusion SDK

    if (!url) {
        return res.status(400).send("Include `url` in the query string or request body");
    }
    if (!url.startsWith("https://api.1inch.dev")) {
        return res.status(400).send("Base URL must start with https://api.1inch.dev");
    }
    next();
});

app.get('/', async (req, res) => {
    axios 
    .get(req.originalUrl.substring(6), { headers })
    .then(response => {
        res.json(response.data)
        console.log('respo00000000000000000:',response)
    })
    .catch(err => console.log('Error:',err))
});

app.get('/tokenPrice', async (req, res) => {
    const { addressOne, addressTwo } = req.query
    const resOne = await Moralis.EvmApi.token.getTokenPrice({
        address: addressOne
    })
    const resTwo = await Moralis.EvmApi.token.getTokenPrice({
        address: addressTwo
    })
    const usdPrices = {
        tokenOne: resOne.raw.usdPrice,
        tokenTwo: resTwo.raw.usdPrice,
        ratio: resOne.raw.usdPrice / resTwo.raw.usdPrice
    }
    return res.status(200).json(usdPrices)
})

app.post('/', async (req, res) => {
    try {
        const response = await fetch(req.query.url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(req.body.data)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error occurred while fetching data: ' + JSON.stringify(error));
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});