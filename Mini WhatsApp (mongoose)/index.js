const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

main()
    .then(() => {
        console.log("Connection Successful");
    })
    .catch((err) => console.log(err));
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

app.get("/", (req,res) => {
    res.send("Working!");
})
// Index Route
app.get("/chats", async (req,res) => {
    let chats = await chat.find();
    res.render("index.ejs", {chats});
})
// New Route
app.get("/chats/new", (req,res) => {
    res.render("new.ejs");
})
// Create Route
app.post("/chats", (req,res) => {
    let { from, to ,msg } = req.body;
    let newChat = new chat({
        from : from,
        to : to,
        msg : msg,
        created_at : new Date()
    })
    newChat
        .save()
        .then((res) => {
            console.log("Chat was saved");
        })
        .catch((err) => {
            console.log(err);
        });
    res.redirect("/chats");
});
// Edit Route
app.get("/chats/:id/edit", async (req,res) => {
    let {id} = req.params;
    let Chat = await chat.findById(id);
    res.render("edit.ejs", {Chat});
})
// Update Route
app.put("/chats/:id", async (req,res) => {
    let {id} = req.params;
    let {msg} = req.body;
    let updatedChat = await chat.findByIdAndUpdate(
        id,
        {msg : msg},
        {runValidators : true, new : true}
    );
    res.redirect("/chats");
})
// Delete Route
app.delete("/chats/:id", async (req,res) => {
    let {id} = req.params;
    let deletedChat = await chat.findByIdAndDelete(id);
    res.redirect("/chats");
})
app.listen(8080, () => {
    console.log("Listening on port 8080.");
})