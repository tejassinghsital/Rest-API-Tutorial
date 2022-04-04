const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const PORT = 4000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.listen(PORT, () => {
 console.log(`Server is running on ${PORT}`);
})

//mongodb database connection
mongoose.connect("mongodb://127.0.0.1:27017/ProductAPI").then(() => {
 console.log("sucessfully Database connected ");
}).catch((err) => {
 console.log(err)
});

//creating a schema and model of Collection(Product)

const productSchema = new mongoose.Schema({
 name: String,
 description: String,
 price: Number
});

const Product = new mongoose.model("Product", productSchema);

//API to create a product

app.post("/api/v1/product/new", async (req, res) => {

 const bodyRetrivedProductData = await Product.create(req.body);

 res.status(200).json({
  success: true,
  bodyRetrivedProductData
 })
})

//API to read all porducts with their details that are available in our database

app.get("/api/v1/products", async (req, res) => {

 const showProductsListFromDatabase = await Product.find();

 res.status(200).json({
  success: true,
  showProductsListFromDatabase
 })
})

//API to update product

app.put("/api/v1/product/:id", async (req, res) => {

 let gettingProductIdThatNeedsUpdate = await Product.findById(req.params.id);

 if (!gettingProductIdThatNeedsUpdate) {
  return res.status(500).json({
   success: false,
   message: "Product not found"
  })
 }
 gettingProductIdThatNeedsUpdate = await Product.findByIdAndUpdate(req.params.id, req.body, {
  new: true
  // useFindAndModify: false,
  // runValidators: true
 })

 res.status(200).json({
  success: true,
  gettingProductIdThatNeedsUpdate
 })

})


//Delete API of rdeleting any product from database

app.delete("/api/v1/product/:id", async (req, res) => {
 const deleteProductWithId = await Product.findById(req.params.id);

 if (!deleteProductWithId) {
  return res.status(500).json({
   success: false,
   message: "Product not found"
  })
 }
 await deleteProductWithId.remove();

 res.status(200).json({
  success: true,
  message: "Below product get deleted successfully",
  deleteProductWithId
 })
})