/* eslint-disable strict */
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Book = require("../models/bookObject");
const JwtManager = require("../jwt/jwtManager");
const jwt = new JwtManager();
const filePath = "../DataBase/books.txt";
const book= require('./Books');

const userCart=[];
let total=0;


router.post('/cart',(req,res,next)=>{
    //if login
    userCart.push()
})

router.get('/cart',(req,res,next)=>{
    //if login
    
})

router.delete('/cart',(req,res,next)=>{
    //if login
    userCart.pop()
})

router.deleteAll('/cart',(req,res,next)=>{
    //if login
    userCart.push()
})



// const user= {
//     name:"name",
//     price: "price"
// };

// function addToCart(){
//     // login auth==true
//     userCart.push(book);

//     total=book.
    
// }
