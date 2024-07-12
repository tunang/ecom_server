const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddle");

const carts = require("../models/Cart");

//@route GET api/cart
//@desc Get cart
//@access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await carts.findOne({ user: req.userId }).populate("user", ["email"]);

    res.json({ success: true, cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internel server error" });
  }
});

//@route POST api/cart
//@desc Create cart
//@access Private
router.post("/", verifyToken, async (req, res) => {
  try {
    const newCart = new carts({
      user: req.userId,
      products: [],
    });

    await newCart.save();

    return res.json({
      success: true,
      message: "Happy learning",
      cart: newCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internel server error" });
  }
});

//@route PUT api/cart
//@desc Update cart
//@access Private

router.put("/", verifyToken, async (req, res) => {
  const { products } = req.body;

  try {
    let updateCart = {
      $set: {
        products: products,
      },
    };
    const cartUpdateCondition = { user: req.userId };

    const result = await carts.findOneAndUpdate(
      cartUpdateCondition,
      updateCart
    );

    if (!result) {
      return res.status(401).on({ success: false, message: "cart not found" });
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

//@route DELETE api/cart
//@desc Delete cart
//@access Private
router.delete("/", verifyToken, async (req, res) => {
  try {
    const cartDeleteCondition = { user: req.userId };

    const deletedCart = await carts.findOneAndDelete(cartDeleteCondition);

    if (!deletedCart) {
      return res
        .status(401)
        .on({
          success: false,
          message: "post not found or user not authotised",
        });
    }
    res.json({ success: true, cart: deletedCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internel server error" });
  }
});

module.exports = router;
