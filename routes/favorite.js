const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddle");

const favProducts = require("../models/FavoriteProducts")

//@route GET api/favorite
//@desc Get favorite products
//@access Private
router.get("/", verifyToken, async (req, res) => {
    try {
      const favProductsList = await favProducts.findOne({ user: req.userId });
  
      res.json({ success: true, favProductsList});
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internel server error" });
    }
});

//@route Post api/favorite
//@desc create favorite products lists in database
//@access Private
router.post("/", verifyToken, async (req, res) => {
  try {
    console.log(1);
    const newFavProductsList = new favProducts({
      user: req.userId,
      products: [],
    });

    await newFavProductsList.save();

    return res.json({
      success: true,
      message: "Happy learning",
      favProductsList: newFavProductsList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internel server error" });
  }
});

//@route PUT api/favorite
//@desc Update favorite products list
//@access Private

router.put("/", verifyToken, async (req, res) => {
  const { products } = req.body;

  console.log(products);

  try {
    let updateFavProductsList = {
      $set: {
        products: products,
      },
    };
    const favProductsListUpdateCondition = { user: req.userId };

    const result = await favProducts.findOneAndUpdate(
      favProductsListUpdateCondition,
      updateFavProductsList
    );

    if (!result) {
      return res.status(401).on({ success: false, message: "fav products list not found" });
    }

    return res.json({
      success: true,
      message: "Happy learning",
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internel server error" });
  }
});

module.exports = router;
