
const Order = require("../models/orders");
const Razorpay = require("razorpay");
const User=require("../models/users")



const purchasePremium = async (req, res) => {
    try {
      var rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
  
      const amountInPaise = 2500; // Convert amount to paise
  
      rzp.orders.create({ amount: amountInPaise, currency: "INR" }, (err, order) => {
        if (err) {
          throw new Error(JSON.stringify(err));
        }
        req.user.createOrder({
          orderid: order.id,
          status: "PENDING"
        })
          .then(() => {
            return res.status(201).json({ order, key_id: rzp.key_id });
          })
          .catch(err => {
            throw new Error(err);
          });
      });
    } catch (err) {
      console.log(err);
      res.status(403).json({ message: "Something went wrong", error: err });
    }
  };
  
  

const updateTransactionStatus = async (req, res) => {
    try {
      const { payment_id, order_id } = req.body;
  
      const order = await Order.findOne({ where: { orderid: order_id } }); //2
  
      await Promise.all([
        order.update({ payment_id, status: 'SUCCESSFUL' }), // Wrapped in Promise.all
        req.user.update({ ispremiumuser: true }) // Wrapped in Promise.all
      ]);
  
  
      return res.status(202).json({ success: true, message: "Transaction is Successful" });


    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Something went wrong", error: err });
    }
  };
  
  
const getPremiumStatus = async (req, res) => {
  try {
    // Retrieve the user from the database using the token or user ID
    const user = await User.findOne({ where: { id: req.user.id } });

    // Check if the user is a premium user
    const isPremiumUser = user.ispremiumuser;

    // Return the premium status in the response
    return res.status(200).json({ isPremiumUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong", error: err });
  }
};


module.exports={purchasePremium,updateTransactionStatus,getPremiumStatus};