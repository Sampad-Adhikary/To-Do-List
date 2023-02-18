const express = require("express");
const https = require("https"); //native node module
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();
var items=[];
var workItems = [];
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/",(req,res)=>{
    var day = date.currDate();
    res.render('list',{kindOfDay: day, newListItems: items});
});

app.get("/work",(req,res)=>{
    var work = "Work";
    res.render('list',{kindOfDay: work, newListItems: workItems});
})

app.post("/",function(req,res){
    item = req.body.newItem
    console.log(req.body.button);
    if(req.body.button === "Work"){
        workItems.push(item);
        res.redirect('/work');
    }
    else{
        items.push(item);
        res.redirect('/');
    }
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server started on port 3000");
}); 