require('dotenv').config();
const http = require('http');
const fs = require('fs');
const weather_api = process.env.API;
const requests = require('requests');

const homeFile = fs.readFileSync('index.html', 'utf-8');

const replaceValue = (homeFileData, apiData) => {
    let changedValues = homeFileData.replace('{%location%}', apiData.name);
    changedValues = changedValues.replace('{%country%}', apiData.sys.country);
    changedValues = changedValues.replace('{%temp_val%}', apiData.main.temp);
    changedValues = changedValues.replace('{%min_temp%}', apiData.main.temp_min);
    changedValues = changedValues.replace('{%max_temp%}', apiData.main.temp_max);

    return changedValues;
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests(`${weather_api}`).on('data', (chunk) => {
            let dataObj = JSON.parse(chunk)
            let arrObj = [dataObj];
            let realTimeData = arrObj.map((val) => replaceValue(homeFile, val)).join();
            res.write(realTimeData);
        })
            .on('end', (err) => {
                if (err) return console.log('connection lost due to error', err);
                console.log('end');
            });
    }
});

server.listen(5000, () => {
    console.log('server is listening');
})