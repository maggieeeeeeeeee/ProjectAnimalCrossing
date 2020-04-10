var aws = require('aws-sdk');
var ses = new aws.SES({ region: 'us-west-2' });
var request = require('request');
var cheerio = require('cheerio');

const checkInventory = () => {
    //Paste the url for the product you want
    const url = "https://www.bestbuy.ca/en-ca/product/nintendo-switch-console-with-neon-red-blue-joy-con/13817625"
    //Paste the cookie of your browser when you manually check website with a browser
    const cookie = "s_ecid=MCMID%7C79492054752386196440424746232672905055; clientId=19uqUEAls4feSRyf; criteoVisitorId=46a77e2b-2ba4-41e8-8d86-a48b61911f96; __gads=ID=e48a165d7cb7d7c3:T=1586370096:S=ALNI_Ma7Xh8Sp3aRFgiOS7KwvqUVKBqWdg; ai_user=UCOpe|2020-04-08T18:21:34.706Z; _fbp=fb.1.1586370208805.207176167; aam_uuid=79913809146967010330383745689542331082; _gcl_au=1.1.793199769.1586370211; _ga=GA1.2.1236116489.1586370085; _gid=GA1.2.1448676837.1586370212; BVBRANDID=2a60507c-01e7-41de-8899-29e3a7859e39; tia=c27872c7e5dd60ef815045d1d3929ccca475f5782686fea89c1453f626461661; tir=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7ZDFlNzU0Y2YtMzIzOC00YmNmLTkwNTEtYWU2MmFkNTRiZWI5fSJ9.uA683Rylih4RGga2WDrxXHYawD-9cYB_2ZmSb_vTJGM; rxVisitor=15864787783033QN1NCFHHVTH6JFNF8K9E9S1NCRQ6CPB; enabled=1; ReturnUrl=https://www.bestbuy.ca/; surveyOptOut=1; AMCVS_D6E638125859683E0A495D2D%40AdobeOrg=1; AMCV_D6E638125859683E0A495D2D%40AdobeOrg=-1303530583%7CMCIDTS%7C18363%7CMCMID%7C79492054752386196440424746232672905055%7CMCAAMLH-1587083584%7C7%7CMCAAMB-1587083584%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1586485984s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C3.3.0%7CMCCIDH%7C-1566761211; s_cc=true; check=true; s_fid=1A1CBC7ED65721D5-29666019EEF29D5E; fdb7491a5cc3d693edd0926b3a48659f=2a36995855aa3e0fe90b0495aec827a4; cid=%7B%22id%22%3A%22%7Bd1e754cf-3238-4bcf-9051-ae62ad54beb9%7D%22%2C%22firstName%22%3A%22Yidi%22%2C%22authenticationState%22%3A%22AUTHENTICATED%22%7D; tx=eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJiMjgzZDY3OS04M2FjLTQ5OTUtOTRhNC1jYWZiNjIxYTc0OGIifQ.qxDncNLxcrzNvpJXARodmsp32xsIaMybruXAsrViU4c; 4b92e78b2a2c24b9f5aaf8ff1d99b6ef=143c3f789b08c315f97e397e3856bc77; dtSa=-; dtLatC=16; dtPC=1$79828656_655h-vISFUUOICDOPTRTZAGYKGEWLTTSUKKIPW; dtCookie=1$9UUTV90546DQOPRP0REV3S3RQVSGJFCS|ea7c4b59f27d43eb|0; rxvt=1586481730357|1586478778309; dtm_mSession=bcfa841352fe4203830487f7e386bc90; _derived_epik=dj0yJnU9MERrOEllWjIzNHZyd2pPTGtzbW1DVnJsOUdjb1NubnQmbj1OS0tETlZsVUNkQWJQRC1Bc3h6TjBRJm09NCZ0PUFBQUFBRjZQeUVrJnJtPTQmcnQ9QUFBQUFGNlB5RWs; QueueITAccepted-SDFrts345E-V3_20191224xmas=EventId%3D20191224xmas%26QueueId%3D00000000-0000-0000-0000-000000000000%26RedirectType%3Dafterevent%26IssueTime%3D1586485898%26Hash%3Dfea533979e58637e53c9db7d2ada63aea54c65a1b8be7e29e1d82afaf930f4fb; BVBRANDSID=b223a86b-30eb-48f7-bc89-2e1f25f8dab0; ai_session=SJd+7|1586485891157.93|1586485891157.93; AA_pagePathingCount=1; s_lv=1586485904207; s_lv_s=Less%20than%201%20day; s_getNewRepeat=1586485904232-Repeat; s_vnum=1588305600773%26vn%3D6; s_invisit=true; AA_previousCategory=pdp; AA_previousPageName=products%20|pdp%20|video%20games%20|13817625; AA_previousPageType=product; AA_previousTA=; s_sq=%5B%5BB%5D%5D; mbox=PC#0b0333236b714052950e98980d8bf163.28_0#1649730721|session#bcfa841352fe4203830487f7e386bc90#1586487755; bm_mi=A93EC3F4B35F11080FDD627CA5D27AA1~k4tIeJqxAy+tdTakDrMHkj2/xKjBUpT1OxHhbMJoGPkz/zEeQeiGwKm8+hrwRYkuOvHRHuiCVRcAPJ1ALv6EUE/rwaD19Ceaoq9EalgHJC2ytqqHcUrxtDVigZKJ0e4mm6xnsNU6mZNJQ5Xi+IBqRz0eva8k+0MDHN6LsYqvJ5u5k2RIqCAzrzZo6dBIpPZvwfQrYfOyBQCfoaH3e38WjOnGJnZrdMzPVhM7jP8f2M65C//Uwc2qGiWNrenmWJZEcjzqfictGEteVm2OFVpfSwkdTCgQJoJ1NhJLVyjxihkVPKtUjuM5FvsbR65IbLsrZPDhiGNvIim6zrr0Hsvbmjuni+P5IQ9u1huB3BNEFY2g9rTCiVa9PE8aZzPN4JPF; cartId=7b479d81-ad19-4812-a1ba-e3f4476f64c4; ak_bmsc=1521FE17F56610AA912B2ED28F9F2064B896463E1C46000085DB8F5E1D107057~plifq7SGI+5c5g9vyff9hWro9BRTMzYzm+R8B8mqcC5Ji1mhjAQ3WCs486VFxdZy/Uxca0/e+TC0bgspD1KEFUdKU1ik1hBK7ZYn2nKkh/2u9cOaDptbNTcqD3nNrQzpD6OU5LXB8P8Cn5LVsj3zaQRLV1WIVq9PwSc6oLgsonhCu9w9WkZ72fgj7i76Y8WVN1uDfh/cOoF9zYsE5vexnXS5qLu3mgN1zd0zY+PuyqOUApF4tzNwWfplaT9OPBw2fU; bm_sv=9813DFAAD915541F8AB4470FB82B41D8~mmWZyv/JxdcT0hkTOUbWaKwCZgaogsotBG9RKAFrlzwzl4hwUGI0qS5vYwcf8GaKdgYpRYveQPVUC6PwN0cUOrXS1CU1+c1Y1khuSZwwCVz0qc69XOoOdAwB7JPAcQVgAUHsFGcp/wLuUpd7s9b/JO9n2PNbNlAKhBO/hDBq1bk=; nps={"currentUrlPath":"/en-ca/product/nintendo-switch-console-with-neon-red-blue-joy-con/13817625","hasSurveyBeenDisplayed":false,"heartBeat":1586486261,"isInSampling":false,"pageViewCount":38,"surveyLastDisplayed":1617906091}";
    //Set up in AWS SES following tutorial
    const sourceEmailAddr = "9909.yidi@gmail.com";
    const destinationEmailAddrs = ["9909.yidi@gmail.com"];
    
    const req = {
        url: url,
        headers: {
            "Accept": "application/json, text/plain, */*",
            "User-Agent": "axios/0.18.0",
            "Cookie": cookie
        }
    }
    request(req, (error, response, body) => {
        if (error) {
            console.log(error);
        }
        console.log("Status code: " + response.statusCode);
        const $ = cheerio.load(body);
        const status = $('.fulfillment-add-to-cart-button div button').text().trim();
        console.log("Inventory status: " + status);
        console.log("time: " + (new Date).toUTCString() + "\n");
        if (status !== "Sold Out") {
            var params = {
                Destination: {
                    ToAddresses: destinationEmailAddrs
                },
                Message: {
                    Body: {
                        Text: { Data: "" }
                    },
                    Subject: { Data: "Nintendo Switch is available!" }
                },
                Source: sourceEmailAddr
            };
            ses.sendEmail(params, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("email sent")
                    console.log(data);
                }
            });
        }
    });
}
console.log("Script starting...")
setInterval(checkInventory, 30000);
