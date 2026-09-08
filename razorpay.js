/*
=========================================================
        RAZORPAY - NODE.JS + REACT.JS INTERVIEW NOTES
=========================================================

Architecture:

React.js
   |
   | 1. Create Order
   v
Node.js / Express
   |
   | 2. Razorpay SDK
   v
Razorpay
   |
   | 3. Order ID
   v
React.js
   |
   | 4. Open Razorpay Checkout
   v
User Pays
   |
   | 5. Payment details
   v
Node.js
   |
   | 6. Verify Signature
   v
Database


IMPORTANT:
- Razorpay Secret Key -> ONLY in Node.js
- Razorpay Key ID -> Can be used in React
- Order creation -> Backend
- Payment verification -> Backend
- Refund -> Backend
- React -> Only frontend/Checkout interaction
*/


/*
=========================================================
              PART 1: NODE.JS / EXPRESS
=========================================================
*/

// Install:
// npm install express razorpay dotenv crypto


// -------------------------------------------------------
// 1. IMPORT PACKAGES
// -------------------------------------------------------

const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();

app.use(express.json());


// -------------------------------------------------------
// 2. RAZORPAY INITIALIZATION
// -------------------------------------------------------

// In Laravel:
//
// $api = new Api($key, $secret);
//
// In Node.js:

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// .env
//
// RAZORPAY_KEY_ID=rzp_test_xxxxx
// RAZORPAY_KEY_SECRET=xxxxxxxx


// -------------------------------------------------------
// 3. CREATE ORDER
// -------------------------------------------------------

// API:
// POST /api/payment/create-order

app.post("/api/payment/create-order", async (req, res) => {

    try {

        // Amount should be in paise
        // ₹500 = 50000 paise

        const options = {
            amount: 50000,
            currency: "INR",

            // Unique receipt number
            receipt: "receipt_123"
        };

        // Create order in Razorpay

        const order = await razorpay.orders.create(options);

        // Send order details to React

        res.json({
            success: true,
            order: order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// -------------------------------------------------------
// 4. FETCH ORDER
// -------------------------------------------------------

// Laravel:
//
// $api->order->fetch($orderId);
//
// Node.js:

app.get("/api/payment/order/:orderId", async (req, res) => {

    try {

        const orderId = req.params.orderId;

        const order = await razorpay.orders.fetch(orderId);

        res.json({
            success: true,
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// -------------------------------------------------------
// 5. FETCH PAYMENT
// -------------------------------------------------------

// Laravel:
//
// $api->payment->fetch($paymentId);
//
// Node.js:

app.get("/api/payment/:paymentId", async (req, res) => {

    try {

        const paymentId = req.params.paymentId;

        const payment = await razorpay.payments.fetch(paymentId);

        res.json({
            success: true,
            payment
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// -------------------------------------------------------
// 6. VERIFY PAYMENT
// -------------------------------------------------------

// Razorpay sends:
//
// razorpay_order_id
// razorpay_payment_id
// razorpay_signature
//
// We verify the signature on the BACKEND.
//
// Never verify using React because the secret key must
// not be exposed to the frontend.

app.post("/api/payment/verify", async (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;


        // Create signature using Razorpay Secret Key

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");


        // Compare generated signature with Razorpay signature

        if (generatedSignature === razorpay_signature) {

            // Payment is valid
            //
            // Usually here we update our database:
            //
            // order.paymentStatus = "paid";
            // order.paymentId = razorpay_payment_id;
            // await order.save();

            return res.json({
                success: true,
                message: "Payment verified successfully"
            });
        }


        // Signature doesn't match

        return res.status(400).json({
            success: false,
            message: "Invalid payment signature"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// -------------------------------------------------------
// 7. REFUND PAYMENT
// -------------------------------------------------------

// Laravel:
//
// $api->payment->fetch($paymentId)->refund();
//
// Node.js:
//
// razorpay.payments.refund(paymentId)
//
// Full refund:

app.post("/api/payment/refund", async (req, res) => {

    try {

        const { paymentId } = req.body;

        const refund = await razorpay.payments.refund(
            paymentId
        );

        res.json({
            success: true,
            refund
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// -------------------------------------------------------
// 8. PARTIAL REFUND
// -------------------------------------------------------

// Example:
// Original payment = ₹500
// Refund = ₹200
//
// ₹200 = 20000 paise

app.post("/api/payment/partial-refund", async (req, res) => {

    try {

        const { paymentId } = req.body;

        const refund = await razorpay.payments.refund(
            paymentId,
            {
                amount: 20000
            }
        );

        res.json({
            success: true,
            refund
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// -------------------------------------------------------
// 9. FETCH REFUND
// -------------------------------------------------------

app.get("/api/payment/refund/:refundId", async (req, res) => {

    try {

        const refundId = req.params.refundId;

        const refund = await razorpay.refunds.fetch(
            refundId
        );

        res.json({
            success: true,
            refund
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// -------------------------------------------------------
// START SERVER
// -------------------------------------------------------

// app.listen(5000, () => {
//     console.log("Server running on port 5000");
// });



/*
=========================================================
              PART 2: REACT.JS
=========================================================

React is responsible for:

1. Calling backend
2. Receiving Razorpay order
3. Opening Razorpay Checkout
4. Getting payment response
5. Sending response to backend

React should NOT:
- Create Razorpay order directly
- Use Razorpay Secret Key
- Verify payment signature
- Process refunds directly
*/


// -------------------------------------------------------
// REACT COMPONENT
// -------------------------------------------------------

import React from "react";
import axios from "axios";

function Payment() {


    // ---------------------------------------------------
    // 1. CREATE ORDER
    // ---------------------------------------------------

    const createOrder = async () => {

        try {

            // Call Node.js backend

            const response = await axios.post(
                "http://localhost:5000/api/payment/create-order"
            );


            // Get order from backend

            const order = response.data.order;


            // Open Razorpay Checkout

            openRazorpayCheckout(order);

        } catch (error) {

            console.log(error);
        }
    };


    // ---------------------------------------------------
    // 2. OPEN RAZORPAY CHECKOUT
    // ---------------------------------------------------

    const openRazorpayCheckout = (order) => {


        // Razorpay Checkout configuration

        const options = {

            // IMPORTANT:
            // Only Key ID is used in React.
            // Never put Secret Key here.

            key: "rzp_test_xxxxx",

            amount: order.amount,

            currency: order.currency,

            name: "My Application",

            description: "Test Payment",

            order_id: order.id,


            // ------------------------------------------------
            // 3. PAYMENT SUCCESS CALLBACK
            // ------------------------------------------------

            handler: async function (response) {

                console.log(response);

                /*
                response contains:

                {
                    razorpay_payment_id,
                    razorpay_order_id,
                    razorpay_signature
                }
                */


                // Send payment details to Node.js
                // for verification.

                try {

                    const result = await axios.post(
                        "http://localhost:5000/api/payment/verify",
                        response
                    );


                    if (result.data.success) {

                        console.log(
                            "Payment successful"
                        );

                    }

                } catch (error) {

                    console.log(
                        "Payment verification failed"
                    );
                }
            },


            // Customer information

            prefill: {

                name: "Harsha",

                email: "test@gmail.com",

                contact: "9999999999"
            },


            // Theme

            theme: {

                color: "#3399cc"
            }
        };


        // Create Razorpay Checkout object

        const paymentObject =
            new window.Razorpay(options);


        // Open payment popup

        paymentObject.open();
    };


    // ---------------------------------------------------
    // 4. REACT BUTTON
    // ---------------------------------------------------

    return (

        <div>

            <h2>Payment</h2>

            <button onClick={createOrder}>
                Pay ₹500
            </button>

        </div>
    );
}


export default Payment;


/*
=========================================================
       RAZORPAY SCRIPT IN REACT / HTML
=========================================================

Add this in public/index.html:

<script src="https://checkout.razorpay.com/v1/checkout.js"></script>


Then:

const paymentObject =
    new window.Razorpay(options);

paymentObject.open();


=========================================================
             IMPORTANT INTERVIEW FLOW
=========================================================

When interviewer asks:

"Explain Razorpay integration in MERN."


Answer:

1. React calls my Node.js API to create an order.

2. Node.js uses Razorpay SDK and Secret Key to
   create the order.

3. Backend sends the Razorpay order ID to React.

4. React opens Razorpay Checkout using the Key ID
   and order ID.

5. User completes the payment.

6. Razorpay returns payment ID, order ID and
   signature to React.

7. React sends these details to Node.js.

8. Node.js verifies the signature using the
   Razorpay Secret Key.

9. If verification is successful, I update my
   database and mark the order as paid.

10. For refunds, I call the Razorpay refund API
    from the Node.js backend.


=========================================================
           LARAVEL VS NODE.JS QUICK REVISION
=========================================================

Laravel:

$api = new Api($key, $secret);

$api->order->create();

$api->order->fetch($orderId);

$api->payment->fetch($paymentId);

$api->payment->fetch($paymentId)->refund();


Node.js:

const razorpay = new Razorpay({
    key_id,
    key_secret
});

razorpay.orders.create();

razorpay.orders.fetch(orderId);

razorpay.payments.fetch(paymentId);

razorpay.payments.refund(paymentId);


=========================================================
              MOST IMPORTANT POINTS
=========================================================

Secret Key
    ↓
ONLY BACKEND

Key ID
    ↓
Can be used in React

Create Order
    ↓
Backend

Checkout
    ↓
React

Payment Verification
    ↓
Backend

Refund
    ↓
Backend

Database Update
    ↓
Backend


=========================================================
*/