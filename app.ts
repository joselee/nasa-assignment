const https = require("https");

interface IFlareInfo {
  activeRegionNum: number;
  beginTime: Date;
  classType: string;
  endTime: Date | null;
  flrID: string;
  instruments: any[];
  linkedEvents: any[];
  peakTime: Date;
  sourceLocation: string;
}

class SolarFlareAPI {
  private readonly apiKey = "N7M2gE2IilLdF3Fi2q88ukB7Szca2SabT5ziTT8t";
  private readonly endpoint =
    "https://api.nasa.gov/DONKI/FLR?startDate=2016-01-01&endDate=2016-12-31&api_key=DEMO_KEY";

  fetchData(cb: Function) {
    const url = this.endpoint.replace("DEMO_KEY", this.apiKey);
    https.get(url, (resp: any) => {
      let dataString = "";
      resp.on("data", (chunk: string) => (dataString += chunk));
      resp.on("end", () => {
        let data: IFlareInfo[] = JSON.parse(dataString);
        cb(data);
      });
    });
  }
}

class SolarFlareProcessor {
    counts = {
        regions: {},
        classes: {}
    };

    constructor() {
        const api = new SolarFlareAPI();
        api.fetchData((data: IFlareInfo[]) => {
            data.forEach(flareInfo => {
                this.register(flareInfo.activeRegionNum, this.counts.regions);
                this.register(flareInfo.classType, this.counts.classes);
            });

            this.writeResults();
        });
    }

    register (info: any, target: any) {
        if (!info) {
            return;
        }
        if (target[info]) {
            target[info]++;
        } else {
            target[info] = 1;
        }
    }

    writeResults () {
        const regions: {[key: string]: number} = this.counts.regions;
        const regionsSorted = Object.keys(regions).sort((a,b) => regions[b]-regions[a]).slice(0, 3);
        console.log("The regions with the most solar flares in 2016 were: " + regionsSorted.join(", "));
        
        const classes: {[key: string]: number} = this.counts.classes;
        const classesSorted = Object.keys(classes).sort((a,b) => classes[b]-classes[a]);
        console.log("The most common class type of solar flare in 2016 was: " + classesSorted[0]);
    }
}

new SolarFlareProcessor();
