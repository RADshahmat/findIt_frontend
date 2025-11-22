import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const PaymentResponse = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const order_id = queryParams.get("order_id");
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const receiptRef = useRef(null);

  const fetchPaymentStatus = async () => {
    try {
      const res = await fetch(
        `https://backend.finditbd.hurairaconsultancy.com/verify-payment/${order_id}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      const data = await res.json();

      if (!res.ok || data.error) setError(data.error || "Payment verification failed.");
      else setResponse(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      setError("Failed to fetch payment status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!order_id) {
      navigate("/");
      return;
    }
    fetchPaymentStatus();
  }, [order_id, navigate]);

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`payment-receipt-${response.customer_order_id}.pdf`);
  };

  const handleBack = () => navigate("/");

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center text-xl font-semibold text-gray-600">
        Verifying payment...
      </div>
    );

  if (error)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
          <p>{error}</p>
        </div>
      </div>
    );

  if (!response)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="bg-yellow-100 text-yellow-700 px-6 py-4 rounded-lg shadow">
          <h2 className="text-2xl font-bold">No Payment Data Found</h2>
        </div>
      </div>
    );

  const success = response.sp_code === "1000" && response.bank_status === "Success";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <button
        onClick={handleBack}
        className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
      >
        ← Back to Home
      </button>

      {/* Receipt Card */}
      <div
        ref={receiptRef}
        className={`w-full max-w-2xl rounded-xl shadow-lg p-6 border 
        ${success ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}
      `}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1
            className={`text-3xl font-bold ${
              success ? "text-green-600" : "text-red-600"
            }`}
          >
            {success ? "✅ Payment Successful" : `❌ Payment ${response.bank_status}`}
          </h1>
          <p className="text-gray-600 mt-2">
            {success
              ? "Your transaction has been completed successfully."
              : "Your payment could not be processed."}
          </p>
        </div>

        {/* Transaction Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Transaction Details
          </h2>

          <div className="grid grid-cols-2 gap-3 text-gray-700">
            <div><strong>Order ID:</strong> {response.customer_order_id}</div>
            <div><strong>Transaction ID:</strong> {response.order_id}</div>
            <div><strong>Method:</strong> {response.method}</div>
            <div><strong>Amount:</strong> {response.amount} {response.currency}</div>
            <div>
              <strong>Status:</strong>{" "}
              <span
                className={`font-bold ${
                  success ? "text-green-600" : "text-red-600"
                }`}
              >
                {response.bank_status}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Customer Information
          </h2>

          <div className="grid grid-cols-2 gap-3 text-gray-700">
            <div><strong>Name:</strong> {response.name}</div>
            <div><strong>Email:</strong> {response.email || "N/A"}</div>
            <div><strong>Phone:</strong> {response.phone_no}</div>
            <div><strong>Address:</strong> {response.address}, {response.city}</div>
            <div><strong>Date & Time:</strong> {response.date_time}</div>
            <div><strong>Message:</strong> {response.sp_message}</div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownloadPDF}
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
      >
        Download Receipt as PDF
      </button>
    </div>
  );
};

export default PaymentResponse;
