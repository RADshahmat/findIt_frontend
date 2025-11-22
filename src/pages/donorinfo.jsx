"use client";

import { useState } from "react";
import React from "react";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const donorSchema = z.object({
  currency: z.enum(["BDT", "USD"], {
    required_error: "Please select a currency",
  }),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  customer_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  customer_phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[+]?[\d\s-()]+$/, "Invalid phone number format"),
  customer_email: z.string().email("Invalid email address"),
  customer_city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be less than 50 characters"),
  customer_address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters"),
});

export default function DonorInfo() {
  const [formData, setFormData] = useState({
    currency: "",
    amount: "",
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_city: "",
    customer_address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  };

  const handlePay = async (e) => {
    e.preventDefault();

    try {
      const validatedData = donorSchema.parse(formData);
      setErrors({});
      setLoading(true);

      const confirmRes = await fetch(
        "https://backend.finditbd.hurairaconsultancy.com/confirm-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validatedData),
        }
      );

      const confirmData = await confirmRes.json();
      if (!confirmData.status || !confirmData.data?.[0]?.my_order_id) {
        throw new Error("Failed to confirm order");
      }

      const my_order_id = confirmData.data[0].my_order_id;

      const payRes = await fetch(
        `https://backend.finditbd.hurairaconsultancy.com/take-payment/${my_order_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const payData = await payRes.json();
      setLoading(false);

      if (payData.checkout_url) {
        window.location.href = payData.checkout_url;
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          if (err.path && err.path[0]) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
        toast.error("Validation error. Please check your input.");
      } else {
        console.error("Unexpected error:", error);
        toast.error(error.message || "Something went wrong!");
      }
    }
  };

  return (
    <>
      <Navbar />

      <section className="py-10 px-4 bg-gray-50 min-h-screen flex justify-center items-start">
        <form
          onSubmit={handlePay}
          className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-8 border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-900">
            Make a Donation
          </h2>
          <p className="text-gray-600 mb-6">
            Your generosity makes a difference
          </p>

          {/* Currency */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency <span className="text-red-500">*</span>
            </label>

            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.currency
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-500"
              } focus:ring-2 outline-none transition`}
            >
              <option value="">Please Select One</option>
              <option value="BDT">BDT</option>
              <option value="USD">USD</option>
            </select>

            {errors.currency && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.currency}
              </span>
            )}
          </div>

          {/* All Inputs */}
          {[
            {
              name: "amount",
              type: "number",
              label: "Donation Amount",
              placeholder: "Enter amount",
            },
            {
              name: "customer_name",
              type: "text",
              label: "Full Name",
              placeholder: "John Doe",
            },
            {
              name: "customer_phone",
              type: "tel",
              label: "Phone Number",
              placeholder: "+880 1XXX-XXXXXX",
            },
            {
              name: "customer_email",
              type: "email",
              label: "Email Address",
              placeholder: "john@example.com",
            },
            {
              name: "customer_city",
              type: "text",
              label: "City",
              placeholder: "Dhaka",
            },
            {
              name: "customer_address",
              type: "text",
              label: "Address",
              placeholder: "Street address",
            },
          ].map((input) => (
            <div key={input.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {input.label}
              </label>

              <input
                type={input.type}
                id={input.name}
                name={input.name}
                value={formData[input.name]}
                onChange={handleChange}
                placeholder={input.placeholder}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors[input.name]
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-500"
                } focus:ring-2 outline-none transition`}
              />

              {errors[input.name] && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors[input.name]}
                </span>
              )}
            </div>
          ))}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white font-semibold transition shadow-sm ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>

          {/* Secure Badge */}
          {loading && (
            <div className="flex items-center justify-center mt-4 text-gray-600 gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Secure Payment Processing</span>
            </div>
          )}
        </form>
      </section>

      <Footer />
      <ToastContainer />
    </>
  );
}
