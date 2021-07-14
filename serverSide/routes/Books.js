const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Book = require('../models/bookObject');
const JwtManager = require('../jwt/jwtManager');
const jwt = new JwtManager();
const filePath ='../DataBase/books.txt';


function getAllBooks() {
    let allBooks = [];
    const items = fs.readFileSync(path.join(__dirname, filePath)).toString().split('\n');
    items.forEach((item) => {
        const elements = item.split(',');
        const product = new Book(elements[0], elements[1], elements[2]);
        allBooks.push(product);
    });
    return allBooks;
}

router.get('/', function (req, res, next) {
    res.json({ status: 'success', message: 'items found', data: getAllBooks() });
});
router.get('/:id', function (req, res, next) {
    const books = getAllBooks();
    let data = 'item not found';
    books.forEach((book) => {
        if (book.id === req.params.id) {
            data = book
            return;
        }
    });
    res.json({ status: 'success', message: data });
});
function writeToFile(books, typeOfOpen) {
    let writeStream;
    try {
        if (typeOfOpen == 'a') {
            writeStream = fs.createWriteStream(path.join(__dirname, '../DataBase/books.txt'),
                { flags: 'a' });
        } else {
            writeStream = fs.createWriteStream(path.join(__dirname, '../DataBase/books.txt'));
        }
        writeStream.write(books);
        writeStream.end();
        return true;
    } catch (error) {
        return false;
    }

}

function isItAlreadySaved(newBook) {
    let result = false;
    try {
        const books = getAllBooks();
        books.forEach((book) => {
            if (newBook.id === book.id) {
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
    const header = req.headers.authorization;
    const verify = jwt.verify(header.split(' ')[1]);
    if (verify.role == 'Admin') {
        const book = req.body;
        const Data = book.id + ',' + book.name + ',' + book.price + '\n';
        if (!isItAlreadySaved(book)) {
            if (writeToFile(Data, 'a')) {
                res.json({ status: 'success', message: 'item saved' });
            } else {
                res.json({ status: 'success', message: 'item faild to save, try again please' });
            }
        } else {
            res.json({ status: 'success', message: 'item already saved' });
        }
    }

});

router.delete('/', function (req, res, next) {
    const header = req.headers.authorization;
    const verify = jwt.verify(header.split(' ')[1]);
    if (verify.role == 'Admin') {
        const books = getAllBooks();
        const book = req.body;
        const newBooks = [];
        books.forEach((oldBook) => {
            if (oldBook.id != '' && oldBook.id !== book.id) {
                newBooks.push(oldBook);
            }
        });
        try {
            writeToFile('');
            newBooks.forEach((book) => {
                const data = book.id + ',' + book.name + ',' + book.price + '\n';
                writeToFile(data, 'a');
            });
            res.json({ status: 'success', message: 'item deleted' });
        } catch (error) {
            res.json({ status: 'faild', message: error });
        }
    } else {
        res.json({ status: 'faild', message: "only Admin can delete", role: req.headers.authorization.split(' ')[1] });
    }


});
router.put('/', function (req, res, next) {
    const header = req.headers.authorization;
    const verify = jwt.verify(header.split(' ')[1]);
    if (verify.role == 'Admin') {
        const book = req.body;
        const data = book.id + ',' + book.name + ',' + book.price + '\n';
        const books = getAllBooks();
        const newProducts = [];
        books.forEach((oldBook) => {
            if (oldBook.id != '') {
                if (oldBook.id == book.id) {

                    newProducts.push(data);
                } else {
                    const old = oldBook.id + ',' + oldBook.name + ',' + oldBook.price + '\n';
                    newProducts.push(old);
                }
            }
        });

        try {
            writeToFile('');
            for (let i = 0; i < newProducts.length; i++) {
                writeToFile(newProducts[i], 'a');


            }
            res.json({ status: 'success', message: 'item updated' });
        } catch (error) {
            res.json({ status: 'faild', message: error });
        }
    } else {
        console.log(req.body.role);
        res.json({ status: 'faild', message: "only Admin can update", role: req.body.role });
    }

});

module.exports = router;