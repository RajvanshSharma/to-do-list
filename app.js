//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin-raj:123@cluster0.yqstbe2.mongodb.net/todolistDB');


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const itemsSchema = {
  name: String
}
const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];
Item.insertMany(defaultItems, function(err){
  if (err) {
    console.log(err);
  } else {
    console.log("Successfully savevd default items to DB.");
  }
});

app.get("/", function(req, res) {
  Item.find({}, function(err, results){
    res.render("list", {listTitle: "Today", newListItems: results});
  });
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const item = new Item({
    name : itemName
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
  const id = req.body.check;
  Item.findByIdAndRemove(id, function(err){
    if(!err){
      console.log("succesfully deleted item");
      res.redirect("/");
    }
  })
});


app.listen(process.env.PORT, function() {
  console.log("Server started on port 3000");
});
