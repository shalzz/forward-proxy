import fetch, {Headers} from "node-fetch";
import express from 'express'
import proxy from 'express-http-proxy';

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/proxy/v1/*', async (req, res) => {
    let url = req.url;
    console.log(url);
    const prefix = '/proxy/v1/'

    const remainingUrl = url.replace(new RegExp('^' + prefix), '')
    let targetUrl = decodeURIComponent(remainingUrl)
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl
    }
    console.log(targetUrl);

    try {
        const customHeaders = new Headers({
            "origin": "https://in.bookmyshow.com",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/117.0",
            "referer": "https://in.bookmyshow.com",
        });
        const result = await fetch(targetUrl, { method: "GET", headers: customHeaders}).then(res => res.text())
        return res.send(result)
    } catch(e) {
        console.log(e);
        res.statusCode = 400
        res.send('Bad Request')
    }
})

app.use('/proxy/v2/', proxy("https://in.bookmyshow.com", {
    proxyReqPathResolver: function (req) {
      var path = req.url;
      console.log(path);
    },
    userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
        const customHeaders = {
            "origin": "https://in.bookmyshow.com",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/117.0",
            "referer": "https://in.bookmyshow.com",
            "Connection": "keep-alive",
            ...headers
        };
        return customHeaders;
    },
    https: true,
  })
)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
