/*jshint esversion: 6 */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const bodyParser = require("body-parser");

// =================================================================================================
// set-up server

const app = express();
const port = 3000;
// =================================================================================================
// Set all the necessary files

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
// =================================================================================================
// Database setup

mongoose.connect(process.env.HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const itemSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your TODOlist!",
});

const item2 = new Item({
  name: "Hit the + button to add new item.",
});

const item3 = new Item({
  name: "<---Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: itemSchema,
};

const List = mongoose.model("List", listSchema);
// =================================================================================================
//Root Get Request to render list data

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (!err) {
          console.log("Successfully Saved default items! ");
        } else {
          console.log(err);
        }
      });
      res.redirect("/");
    }
    res.render("list", {
      items: foundItems,
    });
  });
});
// =================================================================================================
// Root post request to add items to the todo list

app.post("/", (req, res) => {
  const itemName = req.body.newItem;

  if (itemName === "") {
    res.redirect("/");
  } else {
    const item = new Item({
      name: itemName,
    });

    item.save();
    res.redirect("/");
  }
});

// =================================================================================================
//Post request to delete the data from list

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, (err) => {
    res.redirect("/");
  });
});

// =================================================================================================
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
