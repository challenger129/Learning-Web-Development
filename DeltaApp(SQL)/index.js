const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const {v4 : uuidv4} = require("uuid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// const { faker } = require('@faker-js/faker');
// let getRandomUser = () => {
//     return [
//        faker.string.uuid(),
//        faker.internet.username(),
//        faker.internet.email(),
//        faker.internet.password()
//     ];
// };
const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    database : "delta_app",
    password : "Vedant129@"
})

app.listen("8080", () => {
    console.log("server is listening to port 8080");
})

// Home Route
app.get("/", (req,res) => {
    let q = "SELECT count(*) FROM user"
    try{
    connection.query(q, (err, result) => {
    if(err) throw err;
    let count = result[0]["count(*)"];
    res.render("home.ejs", {count});
    });
    } catch (err){
        res.send("Some error in Database");
    }
})

// Show Route
app.get("/user", (req,res) => {
    let q = "SELECT * FROM user"
    try{
    connection.query(q, (err, users) => {
    if(err) throw err;
    res.render("show.ejs", {users});
    });
    } catch (err){
        res.send("Some error in Database");
    }
})

// Edit Route
app.get("/user/:id/edit", (req,res) => {
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`
    try{
    connection.query(q, (err, users) => {
    if(err) throw err;
    let user = users[0];
    console.log(user);
    res.render("edit.ejs", {user});
    });
    } catch (err){
        res.send("Some error in Database");
    }
})

// Update Route
app.patch("/user/:id", (req,res) => {
    let {id} = req.params;
    let {password : formPassword, username : UserName} = req.body;
    let q = `SELECT * FROM user WHERE id = '${id}'`
    try{
    connection.query(q, (err, users) => {
    if(err) throw err;
    let user = users[0];
    if(formPassword == user.password){
        let q2 = `UPDATE user SET username = '${UserName}' WHERE id = '${id}'`;
        connection.query(q2, (err,result) => {
            if(err) throw err;
            res.redirect("/user");
        })
    }
    else{
        res.send("WRONG PASSWORD");
    }
    });
    } catch (err){
        res.send("Some error in Database");
    }
})

// Add Route
app.get("/user/new", (req,res) => {
    res.render("new.ejs");
})

app.post("/user/new", (req,res) => {
    let { username,email,password } = req.body;
    let id = uuidv4();
    let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}', '${username}', '${email}', '${password}')`;

    try{
        connection.query(q, (err,result) => {
            if(err) throw err;
            console.log("Added new user");
            res.redirect("/user");
        });
    }catch (err){
        res.send("some error occurred");
    }
})

// Delete Route
app.get("/user/:id/delete", (req,res) => {
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
        connection.query(q, (err,result) => {
            if(err) throw err;
            let user = result[0];
            res.render("delete.ejs", {user});
        });
    } catch (err){
        res.send("Some Error Occurred");
    }
});
app.delete("/user/:id/", (req,res) => {
    let {id} = req.params;
    let {password} = req.body;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
        connection.query(q, (err,result) => {
            if(err) throw err;
            let user = result[0];
            if(user.password != password){
                res.send("WRONG Password");
            }
            else{
                let q2 = `DELETE FROM user WHERE id = '${id}'`;
                connection.query(q2, (err,result) => {
                    if(err) throw err;
                    else{
                        console.log(result);
                        console.log("deleted!");
                        res.redirect("/user");
                    }
                });
            }
        });
    }catch (err){
        res.send("Some error occurred");
    }
});