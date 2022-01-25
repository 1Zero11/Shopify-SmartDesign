const Shopify = require('shopify-api-node');
const fs = require('fs')
const path = require("path");

async function* makeGenerator() {
    const shopify = new Shopify({
        shopName: process.env.SHOP_NAME,
        accessToken: process.env.API_KEY
    });
    
    let lastid = 0;
    while (true) {
        let x = await shopify.product
            .list({ limit: 1, since_id: lastid});
        if(x.length != 0)
            lastid = x[0].id
        else
            break
        yield x
        
    }
}

  
//f1()


(async function() {
    let list = []
    for await (let num of makeGenerator()) {
      list.push(num)
    }

    console.log(`Количество записей: ${list.length}`)
    

    fs.writeFile('./test.json', JSON.stringify(list), err => {
        if (err) {
          console.error(err)
          return
        }
        //file written successfully
    })

    console.log(`Записано в: ${path.resolve('./test.json')}`)
  })();
