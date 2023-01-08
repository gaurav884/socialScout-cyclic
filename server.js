const express =require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();


const app = express();
app.use(express.json());


mongoose.connect(process.env.mongoURI)
mongoose.connection.on("connected" , ()=>{
    console.log("mongoose connected");
})
mongoose.connection.on("error" , (err)=>{
    console.log(err);
})


const port = process.env.PORT || 3001;




app.use("/post" , require("./routes/post"))
app.use("/auth" , require("./routes/auth"))
app.use("/user" , require("./routes/user"))
app.use("/change-dp" , require("./routes/changeProfilePicture"))
app.use("/change-cover" , require("./routes/changeCoverPhoto"))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,'client','build','index.html'))
    })
}
else{
    app.get("/",(req,res)=>{
        res.send("api running")
    })
}



app.listen(port , ()=>{
    console.log(`server is running on port ${port}`);
})