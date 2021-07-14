const express = require('express');
const router = express.Router();
const book = require('../models/productObject');
const fs = require('fs');
const path = require('path');
const Product = require('../models/productObject');
//create a global array


function getAllProducts() {
    let allProducts = [];
    const items = fs.readFileSync(path.join(__dirname, '../DataBase/products.txt')).toString().split('\n');
    items.forEach((item) => {
        const elements = item.split(',');
        const product = new Product(elements[0], elements[1], elements[2]);
        allProducts.push(product);
    });
    return allProducts;
    // get it from the array
}

router.get('/', function (req, res, next) {
    res.json({ status: 'success', message: 'items found', data: getAllProducts() });
});
router.get('/:id', function (req, res, next) {
    const products = getAllProducts();
    let data = 'item not found';
    products.forEach((product) => {
        if (product.id === req.params.id) {
            // console.log(req.params.id);
            data = product
            return;
        }
    });
    res.json({ status: 'success', message: data });
});
function writeToFile(products, typeOfOpen) {
    let writeStream;
    try {
        if (typeOfOpen == 'a') {
            writeStream = fs.createWriteStream(path.join(__dirname, '../DataBase/products.txt'),
                { flags: 'a' });
        } else {
            writeStream = fs.createWriteStream(path.join(__dirname, '../DataBase/products.txt'));
        }
        writeStream.write(products);
        writeStream.end();
        return true;
    } catch (error) {
        return false;
    }
    //add it to array

}

function isItAlreadySaved(newProduct) {
    let result = false;
    try {
        const products = getAllProducts();
        products.forEach((product) => {
            if (newProduct.id === product.id) {
                result = true;
                return;
            }
        });
    } catch (error) {
        result = false;
    }
    return result;
}

router.post('/', function (req, res, next) {
    const product = req.body;
    const Data = product.id + ',' + product.name + ',' + product.price + '\n';
    if (!isItAlreadySaved(product)) {
        if (writeToFile(Data, 'a')) {
            res.json({ status: 'success', message: 'item saved' });
        } else {
            res.json({ status: 'success', message: 'item faild to save, try again please' });
        }
    } else {
        res.json({ status: 'success', message: 'item already saved' });
    }
});

router.delete('/', function (req, res, next) {
    const items = getAllProducts();
    const product = req.body;
    const newItems = [];
    items.forEach((item) => {
        if (item.id !== product.id) {
            newItems.push(item);
        }
    });
    // console.log(newItems);
    //const headers = `ID,title,isbn,publishedDate,author`;
    try {
        writeToFile('');
        newItems.forEach((product) => {
            const data = product.id + ',' + product.name + ',' + product.price + '\n';
            writeToFile(data, 'a');
        });
        res.json({ status: 'success', message: 'item deleted' });
    } catch (error) {
        res.json({ status: 'faild', message: error });
    }

});
router.put('/', function (req, res, next) {
    const product = req.body;
    const data = product.id + ',' + product.name + ',' + product.price + '\n';

    const products = getAllProducts();
    const newProducts = [];
    products.forEach((item) => {
        if (item.id == product.id) {
            newProducts.push(data);
            // console.log(data.id);
        } else {
            const old = item.id + ',' + item.name + ',' + item.price + '\n';
            newProducts.push(old);
            // console.log("item " + item.id);
        }
    });
    console.log(JSON.stringify(newProducts));
    const headers = `ID,title,isbn,publishedDate,author\n`;
    try {
        writeToFile('');
        for (let i = 0; i < newProducts.length; i++) {
             writeToFile(newProducts[i], 'a');            
        }
        // newItems.forEach((elem) => {
        //     writeToFile(elem, 'a');
        // });
        res.json({ status: 'success', message: 'item updated' });
    } catch (error) {
        res.json({ status: 'faild', message: error });
    }
});

module.exports = router;