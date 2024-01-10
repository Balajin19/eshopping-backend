const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const slugify = require("slugify");
const { requireSignIn, isAdmin, isUser } = require("../middleware/jwt.js");
const CategoryDetails = require("../model/Admin/CategoryModel.js");
const ProductDetails = require("../model/Admin/ProductModel.js");
const fs = require("fs");
const UserDetails = require( "../model/UserModel.js" );
router.get("/", (req, res) => {
  const product = {
    message: "Welcome to PRODUCT",
  };

  res.send(product);
});
router.get("/all-products", async (req, res, next) => {
  try {
    const allProducts = await ProductDetails.find()
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({
        createdAt: -1,
      });
    res.send({ allProducts, message: "All Products List" });
  } catch (err) {
    next(err);
  }
});
router.get("/get-product/:slug", async (req, res, next) => {
  try {
    const product = await ProductDetails.findOne({
      slug: req.params.slug,
    })
      .populate("category")
      .select("-photo");
    if (product) {
      res.send({
        success: true,
        message: "Getting Product successfully",
        product,
      });
    } else {
      res.send({ success: false, message: "No Product Found" });
    }
  } catch (err) {
    next(err);
    res.send({ success: false, message: "Error in getting product" });
  }
});
router.get("/product-photo/:id", async (req, res, next) => {
  try {
    const product = await ProductDetails.findOne({
      _id: req.params.id,
    }).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      res.send(product.photo.data);
    } else {
      res.send({ message: "No Photo Found" });
    }
  } catch (err) {
    next(err);
  }
});
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  async (req, res, next) => {
    try {
      const { name, description, quantity, price, category, shipping } =
        req.fields;
      const { photo } = req.files;
      const products = new ProductDetails({
        ...req.fields,
        slug: slugify(name),
      });
      if (photo) {
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
      }
      await products.save();
      res.send({ products, success: true });
    } catch (err) {
      next(err);
      res.send({ success: false, message: "Error in create product" });
    }
  }
);
router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  formidable(),
  async (req, res, next) => {
    try {
      const { name, description, quantity, price, category, shipping } =
        req.fields;
      const { photo } = req.files;
      const { id } = req.params;

    
      const updateProduct = await ProductDetails.findByIdAndUpdate(
        id,
        {
          ...req.fields,
          slug: slugify(name),
        },
        { new: true }
      );
      if (photo) {
        updateProduct.photo.data = fs.readFileSync(photo.path);
        updateProduct.photo.contentType = photo.type;
      }
      await updateProduct.save();
      res.send({
        updateProduct,
        success: true,
        message: "Product updated successfully!",
      });
    } catch (err) {
      next(err);
      res.send({ success: false, message: "Error in update product" });
    }
  }
);

router.delete("/delete-product/:id", async (req, res, next) => {
  try {
    const product = await ProductDetails.findByIdAndDelete({
      _id: req.params.id,
    });
    res.send({ success: true, message: "Product deleted successfully!" });
  } catch (err) {
    next(err);
    res.send({ success: false, message: "Error in delete product" });
  }
});
router.post("/product-filters", async (req, res) => {
  try
  {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await ProductDetails.find(args).select("-photo");
    res.send({
      success: true,
      message: "Product filtered successfully!",
      products,
    });
  } catch (err) {
    res.send({ success: false, message: "Error in filter product" });
  }
});
router.get("/product-count", async (req, res) => {
  try {
    const total = await ProductDetails.find({}).estimatedDocumentCount();
    res.send({ success: true, total });
  } catch (err) {
    res.send({ success: false, message: "Error in count product" });
  }
});
router.get("/product-list/:page", async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    
    const products = await ProductDetails.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
   
    res.send({ success: true, products });
  } catch (err) {
    res.send({ success: false, message: "Error in list product" });
  }
});
router.get("/search/:keyword", async (req, res) => {
  try {
    const { keyword } = req.params;
    const searchProducts = await ProductDetails.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    res.send({ success: true, searchProducts });
  } catch (err) {
    res.send({ success: false, message: "Error in search product" });
  }
});
router.get("/related-products/:pid/:cid", async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const relatedProducts = await ProductDetails.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.send({ success: true, relatedProducts });
  } catch (err) {
    res.send({ success: false, message: "Error in showing related product" });
  }
});
router.get("/product-category/:slug", async (req, res) => {
  try {
    const category = await CategoryDetails.findOne({ slug: req.params.slug });
    const products = await ProductDetails.find({ category })
      .populate("category")
      .select("-photo");
    res.send({ success: true, products, category });
  } catch (err) {
    res.send({ success: false, message: "Error in showing category product" });
  }
} );


module.exports = router;
