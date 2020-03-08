const express = require('express');
const FileSystem = require('fs');
const app = express();

// import morgan package
const morgan = require('morgan');

//use it
app.use(morgan('dev'));
// Routes which should handle request

// import body-parser
const bodyParser = require('body-parser');
// let's use it
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/users", (req, res, next) => {
    let rawdata = FileSystem.readFileSync('data.json');
    let users = JSON.parse(rawdata);
    res.json(users);
});
app.post("/users", (req, res, next) => {
    let payload = req.body;

    /* Reading the file*/
    let rawdata = FileSystem.readFileSync('data.json');
    let users = JSON.parse(rawdata);

    /*Preparing the payload */
    let newID = Math.max.apply(Math, users.map(function (o) {
        return o.id;
    }));
    newID = newID + 1;
    payload.id = newID;

    /*Preparing the appended payload*/
    users.push(payload);
    console.log(users);

    /*Writing the file*/
    FileSystem.writeFile('data.json', JSON.stringify(users), function (err) {
        if (err) throw err;
        console.log('Replaced!');
    });
    res.json(payload);
});

app.put("/users/:userId", (req, res, next) => {
    console.log(req.params.userId);
    /* Reading the file*/
    let rawdata = FileSystem.readFileSync('data.json');
    let users = JSON.parse(rawdata);

    let payload = req.body;
    for (i = 0; i < users.length; i++) {


        if (users[i].id === Number(req.params.userId)) {
            console.log(users[i]);
            users[i].title = payload.title
        }
    }
    /*Writing the file*/
    FileSystem.writeFile('data.json', JSON.stringify(users), function (err) {
        if (err) throw err;
        console.log('Replaced!');
    });
    console.log(users);
    res.json(req.params.userId);
});

app.delete("/users/:userId", (req, res, next) => {
    console.log(req.params.userId);
    /* Reading the file*/
    let rawdata = FileSystem.readFileSync('data.json');
    let users = JSON.parse(rawdata);

    let payload = req.body;
    for (i = 0; i < users.length; i++) {


        if (users[i].id === Number(req.params.userId)) {
            console.log(users[i]);
            users.splice(i, 1);
        }
    }
    /*Writing the file*/
    FileSystem.writeFile('data.json', JSON.stringify(users), function (err) {
        if (err) throw err;
        console.log('Replaced!');
    });
    console.log(users);
    res.json(req.params.userId);
});



app.listen(3000, () => console.log(`Example app listening on port ${3000}!`));
//export app
module.exports = app;