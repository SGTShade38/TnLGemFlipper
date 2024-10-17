//import { decompress } from 'compress-json';
//import readline from 'readline';
const { decompress } = require('compress-json');
const readline = require('readline');

async function fetchData() {
    try {
        console.log('Starting fetch operation...'); // Log before fetch
        const response = await fetch('https://tldb.info/api/ah/prices');
        console.log('fetch done')
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const prices = await response.json(); // Parse JSON from the response
        //console.log('Data fetched successfully:', prices); // Log the fetched data
        let { list, total, regions } = prices;
        Object.keys(list).forEach((server) => {
            list[server] = decompress(JSON.parse(list[server]));
        });

        //let auctionData = JSON.parse(fs.readFileSync('auctionData.json', 'utf8'));
        //const prices = JSON.parse(fs.readFileSync('prices.json', 'utf8'));



        //gem identifiers
        const PS = '1665561541';
        const RS = '1665561540';
        const QS = '1665561539';
        const PE = '1665561537';
        const RE = '1665561536';
        const QE = '1665561535';
        const PM = '1665561533';
        const RM = '1665561532';
        const QM = '1665561531';
        const PR = '1665561529';
        const RR = '1665561528';
        const QR = '1665561527';

        let items = [
            PS, RS, QS, PE, RE, QE, PM, RM, QM, PR, RR, QR
        ]

        //uncomment and run again to check that ID's are the same if needed
        //auctionData = devalue.unflatten(auctionData.nodes.find((e) => e?.type === 'data').data);
        //auctionData = decompress(auctionData['items']);

        //console.log(list[naEast]['1665561533'].price); //Precious marind price, number from auctionData['items']

        const naEast = '20003'; //NAEast server number
        const tax = .78;
        let profit = 0;
        let increase = 0;
        let spent = 0;

        //COMBINING
        function Combine(low, high, ratio) { //takes PR, RR, etc as high and low
            let lowprice = list[naEast][low].price;
            let highprice = list[naEast][high].price;
            profit = highprice * tax - lowprice * ratio;
            spent = ratio * lowprice;
            increase = profit / spent;
            if (profit > 1) {
                Result(low, high);
            }
        }

        //DISSOLVING
        function Dissolve(high, low, ratio) { //takes PR, RR, etc as high and low
            let lowprice = list[naEast][low].price;
            let highprice = list[naEast][high].price;
            profit = lowprice * ratio * tax - highprice;
            spent = highprice;
            increase = (profit + spent) / spent; //wip, don't know if it is correct
            if (profit > 1) {
                Result(high, low);
            }
        }

        //Output function
        function Result(start, end) {
            console.log(itemName(start), 'to', itemName(end), 'profitable:');
            console.log('Spent:', spent);
            console.log('Profit:', profit);
            console.log('Increase:', increase);
            console.log();
        }
        //String formatting fucntion
        function itemName(id) {
            let st = id;
            switch (st) {
                case '1665561541':
                    st = 'Precious Stalon';
                    break;
                case '1665561540':
                    st = 'Rare Stalon';
                    break;
                case '1665561539':
                    st = 'Quality Stalon';
                    break;
                case '1665561537':
                    st = 'Precious Emeret';
                    break;
                case '1665561536':
                    st = 'Rare Emeret';
                    break;
                case '1665561535':
                    st = 'Quality Emeret';
                    break;
                case '1665561533':
                    st = 'Precious Marind';
                    break;
                case '1665561532':
                    st = 'Rare Marind';
                    break;
                case '1665561531':
                    st = 'Quality Marind';
                    break;
                case '1665561529':
                    st = 'Precious Rubrix';
                    break;
                case '1665561528':
                    st = 'Rare Rubrix';
                    break;
                case '1665561527':
                    st = 'Quality Rubrix';
                    break;
            }
            return st;
        }
        console.log();
        items.forEach(function (item) {
            console.log(itemName(item), ': ', list[naEast][item].price);
        });
        console.log();

        console.log('No results means nothing is currently profitable');

        //COMBINING
        //Rubrix
        Combine(QR, PR, 25);
        Combine(RR, PR, 5);
        Combine(QR, RR, 5);
        //Stalon
        Combine(QS, PS, 25);
        Combine(RS, PS, 5);
        Combine(QS, RS, 5);
        //Emeret
        Combine(QE, PE, 25);
        Combine(RE, PE, 5);
        Combine(QE, RE, 5);
        //Marind
        Combine(QM, PM, 225);
        Combine(RM, PM, 15);
        Combine(QM, RM, 15);

        //DISSOLVING
        //Rubrix
        Dissolve(PR, QR, 25);
        Dissolve(PR, RR, 5);
        Dissolve(RR, QR, 5);
        //Stalon
        Dissolve(PS, QS, 25);
        Dissolve(PS, RS, 5);
        Dissolve(RS, QS, 5);
        //Emeret
        Dissolve(PE, QE, 25);
        Dissolve(PE, RE, 5);
        Dissolve(RE, QE, 5);
        //Marind
        Dissolve(PM, QM, 225);
        Dissolve(PM, RM, 15);
        Dissolve(RM, QM, 15);
        
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question('Press enter to exit', (answer) => {
            rl.close();
        });
        
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Call the async function
fetchData().then(prices => {
    //console.log('Fetched data in main:', prices); // Log the data in the main flow
});

