/* eslint-disable strict */
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Book = require("../models/bookObject");
const JwtManager = require("../jwt/jwtManager");
const jwt = new JwtManager();
const filePath = "../DataBase/history.txt";

function writeToHistoryFile(books, typeOfOpen) {
    let writeStream;
    try {
        if (typeOfOpen == "a") {
            writeStream = fs.createWriteStream(
                path.join(__dirname, filePath),
                { flags: "a" }

            );
        } else {
            writeStream = fs.createWriteStream(
                path.join(__dirname, filePath)
            );
        }
        writeStream.write(books);
        writeStream.end();
        return true;
    } catch (error) {
        return false;
    }
}

router.post('/', (req, res, next) => {
    //if login
    // userCart.push()
    const header = req.headers.authorization;
    const verify = jwt.verify(header.split(" ")[1]);
    const data = getAllBooksfromCart(verify);
    data.forEach(book => {
        const reserveBook = book.userName + "," + book.book.id + ","
            + book.book.name + "," + book.book.price +"\n";
        writeToHistoryFile(reserveBook, "a");
        
    });
    res.json({ status: 'success', data: data });

});
function getAllBooksfromCart(verify) {
    let allBooks = [];
    const items = fs
        .readFileSync(path.join(__dirname, '../DataBase/cart.txt'))
        .toString()
        .split("\n");
    items.forEach(item => {
        const elements = item.split(",");
        if (verify.userName == elements[0]) {
            let reservebook = { userName: elements[0] }
            const book = new Book(elements[1], elements[2], elements[3]);
            reservebook.book = book;
            allBooks.push(reservebook);
        }

    });
    return allBooks;
}
function getAllBooks() {
    let allBooks = [];
    const items = fs
        .readFileSync(path.join(__dirname, filePath))
        .toString()
        .split("\n");
    items.forEach(item => {
        const elements = item.split(",");
        let reservebook = { userName: elements[0] }
        const book = new Book(elements[1], elements[2], elements[3]);
        reservebook.book = book;

        allBooks.push(reservebook);
    });
    return allBooks;
}

router.get('/', (req, res, next) => {
    const header = req.headers.authorization;
    const verify = jwt.verify(header.split(" ")[1]);
    let all = getAllBooks();
    let userBooks = [];
    all.forEach(book => {
        if (verify.userName == book.userName) {
            userBooks.push(book);
        }
    });

    res.json({status: 'success', data: userBooks});
});
module.exports = router;