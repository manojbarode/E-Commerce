import React, { useState } from "react";
import { Minus, Plus, CreditCard, Smartphone, Truck } from "lucide-react";

export default function BuyNow() {
  const [qty, setQty] = useState(1);

  const price = 2499;
  const total = price * qty;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col lg:flex-row gap-6">

      <div className="bg-white p-5 rounded-2xl shadow-lg w-full lg:w-2/3">
        <h1 className="text-xl font-bold mb-4">Buy Now</h1>

        <div className="flex items-center gap-4 border p-4 rounded-xl">
          <img
            src="https://via.placeholder.com/120"
            alt="Product"
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-lg font-semibold">
              Adidas Sports Running Shoes
            </h2>
            <p className="text-gray-600">Men Navy Blue</p>
            <p className="text-xl font-bold mt-2">₹{price}</p>

            {/* Quantity */}
            <div className="flex items-center gap-3 mt-2">
              <button
                className="p-1 border rounded"
                onClick={() => qty > 1 && setQty(qty - 1)}
              >
                <Minus size={18} />
              </button>
              <span className="font-semibold">{qty}</span>
              <button
                className="p-1 border rounded"
                onClick={() => setQty(qty + 1)}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Address Form */}
        <h2 className="text-lg font-bold mt-6 mb-2">Delivery Address</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Full Name" className="input" />
          <input type="text" placeholder="Phone Number" className="input" />
          <input type="text" placeholder="Pincode" className="input" />
          <input type="text" placeholder="City" className="input" />
          <input
            type="text"
            placeholder="Full Address"
            className="md:col-span-2 input"
          />
        </form>

        {/* Payment Methods */}
        <h2 className="text-lg font-bold mt-6 mb-2">Payment Method</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 border p-3 rounded-xl cursor-pointer">
            <input type="radio" name="payment" /> <CreditCard /> Credit / Debit Card
          </label>
          <label className="flex items-center gap-3 border p-3 rounded-xl cursor-pointer">
            <input type="radio" name="payment" /> <Smartphone /> UPI / Wallet
          </label>
          <label className="flex items-center gap-3 border p-3 rounded-xl cursor-pointer">
            <input type="radio" name="payment" /> <Truck /> Cash on Delivery
          </label>
        </div>
      </div>

      {/* Right Section – Price Summary */}
      <div className="bg-white w-full lg:w-1/3 p-5 rounded-2xl shadow-lg h-fit">
        <h2 className="text-xl font-bold mb-4">Price Details</h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <p>Price ({qty} item)</p>
            <p>₹{price * qty}</p>
          </div>
          <div className="flex justify-between">
            <p>Delivery Charges</p>
            <p className="text-green-600">Free</p>
          </div>
          <hr />
          <div className="flex justify-between text-lg font-bold">
            <p>Total Amount</p>
            <p>₹{total}</p>
          </div>
        </div>

        <button className="w-full mt-6 bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700">
          Place Order
        </button>
      </div>
    </div>
  );
}
