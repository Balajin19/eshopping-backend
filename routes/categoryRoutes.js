const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const { requireSignIn, isAdmin, isUser } = require("../middleware/jwt.js");
const CategoryDetails = require("../model/Admin/CategoryModel.js");
router.get("/", (req, res) => {
  const category = {
    message: "Welcome to CATEGORY",
  };

  res.send(category);
});
router.get( "/all-categories", async ( req, res, next ) =>
{
  try
  {
    const allCategories = await CategoryDetails.find().populate();
      res.send({ allCategories, message: "All Catergories List" });

  }
  catch ( err )
  {
    next(err)
  }
});
router.get("/get-category/:slug", async (req, res, next) => {
  try {
    const catergory = await CategoryDetails.findOne({
      slug: req.params.slug,
    } ).populate();
         res.send({ catergory, message: "Getting Catergory successfully" });

  } catch (err) {
    next(err);
  }
});
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const existCategory = await CategoryDetails.findOne({ name });
      if (existCategory) {
        throw new Error(`${name} category already exists`);
      }
      const addCategory = await new CategoryDetails({
        name,
        slug: slugify(name),
      } ).save();
      const allCategories = await CategoryDetails.find().populate();
      res.send({ allCategories, message: "New Category Added!",success:true });
    } catch (err) {
      next(err);
    }
  }
);
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  async (req, res, next) => {
    try {
     
      const { name } = req.body;
      const { id } = req.params;
      const updateCategory = await CategoryDetails.findByIdAndUpdate(id,{ name,slug:slugify(name) },{new:true});
     
      res.send({
        success: true,
        message: "Category updated successfully!",
        updateCategory,
      });
    } catch (err) {
      next(err);
    }
  }
);
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const catergory = await CategoryDetails.findByIdAndDelete({
        _id: req.params.id,
      });
      res.send({ catergory, message: "Catergory deleted successfully!",success:true });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
