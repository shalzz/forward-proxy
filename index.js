import fetch, {Headers} from "node-fetch";
import express from 'express'

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/proxy/*', async (req, res) => {
    let url = req.url;
    console.log(url);
    const prefix = '/proxy/'

    const remainingUrl = url.replace(new RegExp('^' + prefix), '')
    let targetUrl = decodeURIComponent(remainingUrl)
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl
    }
    console.log(targetUrl);

    try {
        const customHeaders = new Headers({
            "Origin": "https://in.bookmyshow.com",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/117.0",
            "Referer": "https://in.bookmyshow.com",
        });
        const result = await fetch(targetUrl, { method: "GET", headers: customHeaders}).then(res => res.text())
        return res.send(result)
    } catch(e) {
        console.log(e);
        res.statusCode = 400
        res.send('Bad Request')
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
