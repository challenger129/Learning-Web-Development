const mongoose = require("mongoose");
const chat = require("./models/chat.js");

main()
    .then(() => {
        console.log("Connection Successful");
    })
    .catch((err) => console.log(err));
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

let allChats = [
    {
        from : "Vedant",
        to : "Govind",
        msg : "Jai Mata Di",
        created_at : new Date()
    },
    {
        from : "Vaibhav",
        to : "Unnat",
        msg : "Waheguru Ji Da Khalsa Waheguru Ji Di Fateh",
        created_at : new Date()
    },
    {
        from : "Dheeraj",
        to : "Gopesh",
        msg : "Jai Shree Ram",
        created_at : new Date()
    },
    {
        from : "Sudhanshu",
        to : "Ketan",
        msg : "Jai Mahakal",
        created_at : new Date()
    }
]

chat.insertMany(allChats);