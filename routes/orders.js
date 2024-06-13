const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddle");

const orders = require("../models/Orders");

// router.get("/", (req, res) => {
//   res.send("ORDER ROUTE");
// });

//@route GET api/orders
//@desc Get orders by users
//@access Private
router.get("/", verifyToken, async (req, res) => {
    try {
      const userOrders = await orders.find({ user: req.userId }).populate("user", ["email", "firstname", "lastname"]);
  
      res.json({ success: true, userOrders : userOrders });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internel server error" });
    }
  });


//@route POST api/orders
//@desc Create orders
//@access Private
router.post("/", verifyToken, async (req, res) => {
  const { address, payment, products } = req.body;

  try {
    const newOrder = new orders({
      user: req.userId,
      address,
      payment,
      products,
    });

    await newOrder.save();

    return res.json({
      success: true,
      message: "Happy learning",
      order: newOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internel server error" });
  }
});

//@route DELETE api/orders
//@desc Create orders
//@access Private
router.delete('/:id', verifyToken, async(req, res) => {
    try {
      const orderDeleteCondition = {_id: req.params.id, user: req.userId};
  
      const deletedOrder = await orders.findOneAndDelete(orderDeleteCondition)
  
      if (!deletedOrder) {
        return res.status(401).on({ success: false, message: "post not found or user not authotised" });
      }
  
      res.json({success: true, order: deletedOrder});
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internel server error" });
    }
})


module.exports = router;
