import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const Home = () => {
  const cartItems = [
    {
      id: 1,
      name: "Laptop",
      quantity: 1,
      price: 999.99,
    },
    {
      id: 2,
      name: "Wireless Mouse",
      quantity: 2,
      price: 25.5,
    },
    {
      id: 3,
      name: "Keyboard",
      quantity: 1,
      price: 49.99,
    },
    {
      id: 4,
      name: "USB-C Cable",
      quantity: 3,
      price: 15.0,
    },
    {
      id: 5,
      name: "Headphones",
      quantity: 1,
      price: 199.99,
    },
  ];

  const [item, setItem] = useState([...cartItems]);

  const payNow = async () => {
    const stripe = await loadStripe(
      "pk_test_51QbkduJ5I3eniT6hCrr20G46ebQiNi1zpPGQ23cFhJN8kr69uIlBgy0sAP9PuMPVMnbSksbUuhyVwl5rjwoHtmRE00HUYfnlc8"
    );

    const response = await axios.post("http://localhost:3000/api/v1/checkout", {
      products: item,
    });

    console.log(response.data.id);

    const result = stripe.redirectToCheckout({
      sessionId: response.data.id,
    });
  };

  const increaseQuantity = (index) => {
    item[index].quantity += 1;
    setItem([...item]);
  };
  const decreaseQuantity = (index) => {
    item[index].quantity -= 1;
    setItem([...item]);
  };
  const deleteItem = (index) => {
    item.splice(index, 1);
    setItem([...item]);
  };
  return (
    <>
     <div class="max-w-4xl mx-auto p-4 border border-gray-300 rounded-lg flex flex-col">
  <h1 class="text-2xl font-bold text-center mb-6 border-b pb-4">Checkout</h1>

  <div class="flex flex-col gap-4">
    {item.map((item, index) => {
      return (
        <div
          class="border border-gray-300 rounded-lg p-6 shadow-md flex flex-col items-center md:flex-row md:justify-between"
          key={item.id}
        >
          <div class="flex flex-col items-center md:items-start">
            <p class="text-lg font-semibold">Name: <span class="text-gray-700">{item.name}</span></p>
            <p class="text-lg font-semibold">Quantity: <span class="text-gray-700">{item.quantity}</span></p>
            <p class="text-lg font-semibold">Price: <span class="text-gray-700">${item.price * item.quantity}</span></p>
          </div>
          <div class="flex gap-3 mt-4 md:mt-0">
            <button 
              onClick={() => decreaseQuantity(index)}
              class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              -
            </button>
            <button 
              onClick={() => increaseQuantity(index)}
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              +
            </button>
            <button 
              onClick={() => deleteItem(index)}
              class="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Delete
            </button>
          </div>
        </div>
      );
    })}
  </div>

  <div class="text-center mt-12 border-t pt-6">
    <button 
      onClick={payNow}
      class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
    >
      Pay Now
    </button>
  </div>
</div>

    </>
  );
};

export default Home;