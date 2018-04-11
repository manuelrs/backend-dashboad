const express = require("express");
const axios = require("axios");
const router = express.Router();
const config = require("../config");

const acquisition = axios.create({
    baseURL: "http://mock-api.voodoo.io/",
    params: {
        api_key: "31I4HHdML8AH30OQCqbuRswzFcvhigvs3f15UQqc6VuOnTNzKYJosB43I5vE2o2SmwNYhh7oCS5X1XUJjhDzlnX9RugHJ"
    }
});

const monetization = axios.create({
    baseURL: "http://mock-api.voodoo.io/"
});

router.get("/acquisition/", (req, res, next) => {
    console.log("req ", req.query)
    acquisition
        .get(`/acquisition`, {
            params: req.query
        })
        .then(response => {
            res.json(response.data);
        })
        .catch(err => {
            if (!err.response) return next(err);
            res.status(err.response.status).json(err.response.data);
        });
});

router.get("/monetization/", (req, res, next) => {
    console.log("req ", req.query)
    monetization
        .get(`/monetization`, {
            params: req.query,
            headers: {
                Authorization: "Bearer mwNNiwFuJ30GqpuYwQHSW0XQx93E2rIS7NRSfxwLz4XI5Yoo5aSP8wvyibhVO8aYeaVLYsCJcFP9V0uzo95ph66qktQwE"
            }
        }, )
        .then(response => {
            //console.log("response ", response.data.data)
            var renamedResponse = []
            response.data.data.forEach(dataset => {
                var renamedObject = renameKeys(dataset, newKeys);
                renamedResponse.push(renamedObject)
            })
            console.log("response ", renamedResponse)
            res.json(renamedResponse);
        })
        .catch(err => {
            if (!err.response) return next(err);
            res.status(err.response.status).json(err.response.data);
        });
});

module.exports = router;

//Conciliate the difference in the key names between acquisition and monetization endpoints.
//Used acquisition as reference. 
function renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map(key => {
        const newKey = newKeys[key] || key;
        return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
}

const newKeys = {
    date: "day",
    format: "ad_type",
    os: "platform",
    game: "application"
}