const fs = require('fs')
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate')
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


//server

const server = http.createServer((req, res) => {
    console.log(req.url);


    const { query, pathname } = url.parse(req.url, true);
    // const pathname = req.url;

    //overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'content-type': 'text/html'
        })

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        // console.log(cardsHtml);
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

        res.end(output)
    }

    //product page
    else if (pathname === '/product') {
        res.writeHead(200, { 'content-type': 'text/html' })
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);

        res.end(output)
    }

    //API
    else if (pathname === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(data);
    }

    //Not found
    else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'hello-world'
        })
        res.end('<h1>page not found</h1>')
    }
});
//port,localhost
server.listen(8000, '127.0.0.1', () => {
    console.log('listening to request on port 8000');
})
