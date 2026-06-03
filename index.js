const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN;
const OBJECT_TYPE = '2-203676930';
const BASE_URL = 'https://api.hubapi.com';

// ROUTE 1 - Homepage
app.get('/', async (req, res) => {
    const url = `${BASE_URL}/crm/v3/objects/${OBJECT_TYPE}?properties=name,country,best_season`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Destinations | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
    }
});

// ROUTE 2 - Form
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3 - Create record
app.post('/update-cobj', async (req, res) => {
    const newDestination = {
        properties: {
            name: req.body.name,
            country: req.body.country,
            best_season: req.body.best_season
        }
    };
    const url = `${BASE_URL}/crm/v3/objects/${OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        await axios.post(url, newDestination, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));