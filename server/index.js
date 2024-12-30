import express from "express";
import cors from "cors";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51QbkduJ5I3eniT6hi7Y89CnduxnFOtteRf0szCVFkaacGAVHRHFXjA2LICDG9tc2huH7Llv21BSFGaLcvDs7WTOB00tCNw1ZLC"
);

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/v1/checkout", async (req, res) => {
  const { products } = req.body;
  const lineItems = products.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel",
  });

  res.json({ message: "session completed", id: session.id });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});