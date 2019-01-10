/* Started with this plain js file, then quickly switched over to typescript */

const https = require("https");
const _ = require("lodash");

const apiKey = "N7M2gE2IilLdF3Fi2q88ukB7Szca2SabT5ziTT8t";
const endpoint = "https://api.nasa.gov/DONKI/FLR?startDate=2016-01-01&endDate=2016-12-31&api_key=DEMO_KEY";
const url = endpoint.replace("DEMO_KEY", apiKey);
console.log(url);
https.get(url, resp => {
    let data = "";
    resp.on("data", chunk => data += chunk);
    resp.on("end", () => {
        data = JSON.parse(data);
        // console.log(data);

        let counts = {
            regions: {},
            classes: {}
        };

        const register = (info, target) => {
            if(!info) {
                return;
            }
            if(target[info]) {
                target[info]++;
            } else {
                target[info] = 1;
            }
        };

        data.forEach(flareInfo => {
            register(flareInfo.activeRegionNum, counts.regions);
            register(flareInfo.classType, counts.classes);
        });

        console.log(counts);
    });
});