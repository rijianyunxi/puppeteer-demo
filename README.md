# puppeteer-demo 

### 前言

刚刚学了点puppeteer，于是就迫不及待写了个小demo来练练手

### 做了什么

  **要实现的思路是**

  * 随机访问列表里的url
  * 随机ip地址
  * 随机uesr-agent
  * 随机refer
  * 访问之后模拟点击到另一页面
  
  **既然要随机那肯定得用随机数**

  ```
    function randoms(m, n) {
        return parseInt(Math.random() * (n - m) + m,10)
    }

  ```
  
  **这样就能生成m-n的随机整数了**

  **接下来就是ip，需要用到代理ip**

  ```
    function getIp() {
        return new Promise((resolve, reject) => {
            axios.get('接口').end((err, res) => {
                if (err) {
                    resolve('127.0.0.1:1080')
                } else {
                    resolve(res.text)
                }
            })
        })
    }

  ```

  **接下来就是puppeteer了**

  ```
    #安装依赖 很大哦
    cnpm install puppeteer --save
  ```
    **简单的用法**
    ```

        const puppeteer = require('puppeteer');
        
        (async () => {
        //实例化一个浏览器
        const browser = await puppeteer.launch();
        //浏览器新建一个页面
        const page = await browser.newPage();
        //访问https://example.com
        await page.goto('https://example.com');
        //页面截图 保存
        await page.screenshot({path: 'example.png'});
        //关闭浏览器
        await browser.close();
        })();


    ```
    **一些其他的配置参见**

    [我的博客地址]([https://songjin](https://songjintao.cn/index.php/2020/04/12/puppeteer-02/))

    **接下来就是设置代理ip和随机referer**

    ```
    #把代理ip放在args里就可以了
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

    ```

    **进行访问,并设置超时，然后模拟点击，点击之后检测到执行完成大功告成**

    ```
        await page.goto(`${url}`, { timeout: 60000 });
        const btn = await page.$(`#colophon > div > div.footer-device > p > span > a:nth-child(1)`);
        await btn.click();
        await page.waitForSelector('#centerbg > div > h1', { timeout: 60000 })

    ```

    **这就是简单的使用puteer**
    **最最重要的是百度统计会增加流量**


