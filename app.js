const express = require("express");
const https = require("https"); //native node module
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {
  useNewUrlParser: true,
});

const itemSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todolist",
});

const item2 = new Item({
  name: "Hit the + button to add a new item",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item",
});

//default list
const defaultItems = [item1, item2, item3];
const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List",listSchema);
const date = require(__dirname + "/date.js");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var day = date.currDate();

app.get("/", (req, res) => {
  Item.find({})
    .then((foundItems) => {
        if(foundItems.length === 0){
            Item.insertMany(defaultItems).then((result) => {
                if (result) {
                  console.log("Successfully saved all items to todolistDB");
                } else {
                  console.log(result);
                }
              });
            res.redirect("/");
        }
        else
            res.render("list", { kindOfDay: day, newListItems: foundItems });
    })
    .catch((err) => {
      console.log(err);
    });
  
  
});

app.get("/:customListName",(req,res)=>{
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name:customListName}).then(foundList=>{
        if(!foundList){
            const list = new List({
                name: customListName,
                items: defaultItems
            })
            list.save();
            res.redirect("/"+customListName);
        }
        else{
            res.render("list",{kindOfDay: foundList.name, newListItems: foundList.items});
        }
    })
    
})

app.post("/",(req,res)=>{
    const route = req.body.customList;
    res.redirect("/"+route);
})

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.button;
  const item = new Item({ name: itemName});
  if(listName === day){
    item.save();
    res.redirect("/");
  }
  else{
    List.findOne({name:listName}).then(foundList=>{
        if(foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName)
        } else {
            console.log("List not found");
        }
    })
  }
});

app.post("/delete",(req,res)=>{
    const checked = req.body.checkbox;
    const listName = req.body.listName;
    if(listName === day){
        Item.findByIdAndDelete(checked)
  .then(deletedItem => {
    console.log(`Deleted item: ${deletedItem}`);
    res.redirect("/");
  })
  .catch(err => {
    console.log(err);
  });
    }
    else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id: checked}}}).then(foundList=>{
            res.redirect("/"+listName);
        })
    }
    
})

app.listen(process.env.PORT || 5000, function () {
  console.log("Server started on port 3000");
});
