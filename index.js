const express = require("express");
const path = require("path");
const {connectToMongoDB} = require("./connection");
const URL = require("./models/url")
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const app = express();
const PORT = 3000;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(()=> console.log("mongodb connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/url",urlRoute);

app.use("/",staticRoute);

app.get("/test",async(req , res)=>{
    const allUrls = await URL.find({});
    return res.render("home", {
        urls: allUrls,
    })
});

app.get("/test/:shortId" , async (req , res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
         shortUrl : shortId
    } , { $push : {
        visitHistory :{ timestamp: Date.now()}
    }});
    res.redirect(entry.redirectUrl);
});



app.listen(PORT, () => {
    console.log(`server started at Port : ${PORT}`)
});