const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Courses = require('../models/coursesObject');



function getAllCourses() {
    let allCourses = [];
    const items = fs.readFileSync(path.join(__dirname, '../DataBase/courses.txt')).toString().split('\n');
    items.forEach((item) => {
        const elements = item.split(',');
        const Course = new Courses(elements[0], elements[1], elements[2]);
        allCourses.push(Course);
    });
    return allCourses;
}

router.get('/', function (req, res, next) {
    res.json({ status: 'success', message: 'items found', data: getAllCourses() });
});
router.get('/:id', function (req, res, next) {
    const courses = getAllCourses();
    let data = 'item not found';
    courses.forEach((courses) => {
        if (courses.id === req.params.id) {
            // console.log(req.params.id);
            data = courses
            return;
        }
    });
    res.json({ status: 'success', message: data });
});
function writeToFile(courses, typeOfOpen) {
    let writeStream;
    try {
        if (typeOfOpen == 'a') {
            writeStream = fs.createWriteStream(path.join(__dirname, '../DataBase/courses.txt'),
                { flags: 'a' });
        } else {
            writeStream = fs.createWriteStream(path.join(__dirname, '../DataBase/courses.txt'));
        }
        writeStream.write(courses);
        writeStream.end();
        return true;
    } catch (error) {
        return false;
    }
}

function isItAlreadySaved(newCourse) {
    let result = false;
    try {
        const Courses = getAllCourses();
        Courses.forEach((Course) => {
            if (newCourse.id === Course.id) {
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
    const Course = req.body;
    const Data = Course.id + ',' + Course.name + ',' + Course.code + '\n';
    if (!isItAlreadySaved(Course)) {
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
    const courses = getAllCourses();
    const course = req.body;
    const newItems = [];
    courses.forEach((item) => {
        if (item.id !== course.id) {
            newItems.push(item);
        }
    });
    try {
        writeToFile('');
        newItems.forEach((course) => {
            const data = course.id + ',' + course.name + ',' + course.code + '\n';
            writeToFile(data, 'a');
        });
        res.json({ status: 'success', message: 'item deleted' });
    } catch (error) {
        res.json({ status: 'faild', message: error });
    }

});
router.put('/', function (req, res, next) {
    const course = req.body;
    const data = course.id + ',' + course.name + ',' + course.code + '\n';
    const courses = getAllCourses();
    const newCourses = [];
    courses.forEach((item) => {
        if (item.id == course.id) {
            newCourses.push(data);
        } else {
            const old = item.id + ',' + item.name + ',' + item.code + '\n';
            newCourses.push(old);
        }
    });
    try {
        writeToFile('');
        for (let i = 0; i < newCourses.length; i++) {
            writeToFile(newCourses[i], 'a');
        }
        res.json({ status: 'success', message: 'item updated' });
    } catch (error) {
        res.json({ status: 'faild', message: error });
    }
});
module.exports = router;