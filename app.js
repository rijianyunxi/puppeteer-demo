const puppeteer = require('puppeteer')
const axios = require('superagent')
const {uas,refers,urls} = require('./config')
const schedule = require('node-schedule')
const fs = require('fs')

function getIp() {
    return new Promise((resolve, reject) => {
        axios.get('http://api.xdaili.cn/xdaili-api//greatRecharge/getGreatIp?spiderId=a425b9cce46b4fcd9732fe5d6ecf2fa4&orderno=YZ20181046667n7qACJ&returnType=1&count=1').end((err, res) => {
            if (err) {
                resolve('127.0.0.1:1080')
            } else {
                resolve(res.text)
            }
        })
    })
}


function randoms(m, n) {
    return parseInt(Math.random() * (n - m) + m,10)
}
async function go() {
    let ip = await getIp();
    let ua = uas[randoms(1, 26)];
    let refer = refers[randoms(1,15)];
    let url = urls[randoms(1,11)];
    let err = false;
    console.log("访问网站是："+url+" 代理ip是：" + ip + "ua是" + ua+"   refer是："+refer);
    const browser = await puppeteer.launch({
        headless: true,
        //`--proxy-server=http://${ip}`,'--no-sandbox', '--disable-setuid-sandbox'
        args: [`--proxy-server=http://${ip}`],
        devtools: true
    });
    const page = await browser.newPage();
    await page.setUserAgent(ua);
    await page.setExtraHTTPHeaders({
        referer: `${refer}`
      });
    try {
        await page.goto(`${url}`, { timeout: 60000 });
    }
    catch (e) {
        console.log('第一次超时，继续执行');
    } finally {
        try {
            const btn = await page.$(`#colophon > div > div.footer-device > p > span > a:nth-child(1)`);
            await btn.click();
            await page.waitForSelector('#centerbg > div > h1', { timeout: 60000 })
        }
        catch (e) {
            err = true
        }
        await page.waitFor(50000);
        if(err){
            fs.appendFile('a.txt',`${new Date().toLocaleString()}失败\r\n`,err=>{
                console.log('失败');
            })
        }else{
            fs.appendFile('a.txt',`${new Date().toLocaleString()}成功\r\n`,err=>{
                console.log("成功");
            })
        }
        await page.waitFor(randoms(30000,60000));
        await browser.close();        
    }
};
//go()
let j1 = schedule.scheduleJob('*/6 * * * *',()=>{
    go();
})