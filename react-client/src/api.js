import axios from "axios";

const voodoo = axios.create({
    baseURL:
        process.env.NODE_ENV === "production" ? "/api/voodoo" : "http://localhost:3000/api/voodoo"
});

const errHandler = err => {
    console.error(err.response.data);
    throw err.response.data;
};

export function getAcquisitionData(dates) {
    return voodoo
        .get(
            `/acquisition/?start=${
            dates.startDate
            }&end=${dates.endDate}&format=json&columns=day,impressions,clicks,ctr,cost,country,ad_type,platform,application,package_name`
        )
        .then(res => {
            return res.data;
        })
        .catch(errHandler);
}

export function getMonetizationData(dates) {
    return voodoo
        .get(
            `/monetization/?start=${
            dates.startDate
            }&end=${dates.endDate}&dimensions=date,format,country,os,game&aggregates=views,conversions,revenue`
        )
        .then(res => {
            return res.data;
        })
        .catch(errHandler);
}