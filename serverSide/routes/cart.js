/* eslint-disable strict */
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Book = require("../models/bookObject");
const JwtManager = require("../jwt/jwtManager");
const jwt = new JwtManager();
const filePath = "../DataBase/cart.txt";
//const book = require('./Books');

const userCart = [];
let total = 0;

function writeToFile(books, typeOfOpen) {
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
  const data = req.body;
  const reserveBook = verify.userName + "," + data.id + "," + data.name + "," + data.price + "\n";
  writeToFile(reserveBook, "a");

  res.json({ status: 'success', message: 'book is reserved' });

});

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

  res.json({
    status: 'success', data: userBooks
  });
});

router.delete('/', (req, res, next) => {
  const data = getAllBooks();
  const userData = [];
  const header = req.headers.authorization;
  const verify = jwt.verify(header.split(" ")[1]);
  const userName = verify.userName;
  const bookId = req.body.id;
  let newData = [];
  data.forEach(book => {
    if (userName == book.userName) {
      userData.push(book);
    } else {
      newData.push(book);
    }
  });
  userData.forEach(item => {
    if (item.book.id != bookId) {
      newData.push(item);
    }
  });
  writeToFile("");
  newData.forEach(book => {
    let data = book.userName + ',' + book.book.id + ','
      + book.book.name + ',' + book.book.price + '\n';
    writeToFile(data, "a");
  });
  res.json({ ststus: 'success', data: newData });

});

router.delete('/all', (req, res, next) => {
  writeToFile("");
  res.json({ ststus: 'success', data: "delete" });
});
module.exports = router;