import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import styles from "./Order_details.module.css";

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderId = location.state?.orderId || null;
  const [selectedProduct, setSelectedProduct] = useState(null); // State to store the selected product
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(""); // For handling errors
  const [orderStatus, setOrderStatus] = useState(""); // State to store order status like 'created', 'billed', etc.

  // Fetch order details based on the orderId
  useEffect(() => {
    if (!orderId) {
      setError("No order found.");
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`,
          { withCredentials: true }
        );

        // Filter orders to find the matching orderId
        const order = response.data.user?.orderHistory.find(
          (order) => order._id === orderId
        );

        if (order) {
          setSelectedProduct(order); // Store order details
          setOrderStatus(order.deliveryStatus);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(err.response?.data?.message || "Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Function to generate and download the invoice as a PDF
  const generateInvoice = () => {
    const amount = selectedProduct.price * selectedProduct.quantity;
    const gstRate = 18; // GST in percentage
    const gstAmount = (amount * gstRate) / 100;
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    const addNewPageIfNeeded = (doc, yPos) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        return 20; // Reset yPosition for the new page
      }
      return yPos;
    };

    // Header with branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Shivam Mart Invoice", 20, yPosition);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Invoice No.: ${orderId}`, 90, yPosition);
    yPosition += 10;
    doc.text(`Issue Date: ${selectedProduct.orderDate}`, 90, yPosition);
    yPosition += 10;
    // doc.text(`Due Date: ${selectedProduct.dueDate || "N/A"}`, 150, yPosition);
    // yPosition += 20;

    // Divider line
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;

    // Shipping Address
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Billing Details:", 20, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Name: ${selectedProduct.user_name}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Phone: ${selectedProduct.user_phoneNumber}`, 20, yPosition);
    yPosition += 10;
    doc.text(
      `Address: ${selectedProduct.village}, ${selectedProduct.district}, ${selectedProduct.state}, ${selectedProduct.pincode}`,
      20,
      yPosition
    );
    yPosition += 20;

    // Products Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Products Ordered:", 20, yPosition);
    yPosition += 10;

    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPosition, 170, 10, "F"); // Header background
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Description", 25, yPosition + 7);
    doc.text("Quantity", 70, yPosition + 7);
    doc.text("Unit Price (Rs)", 100, yPosition + 7);
    doc.text("Amount (Rs)", 160, yPosition + 7);
    yPosition += 15;

    // Table Body

    doc.setFont("helvetica", "normal");
    doc.text(selectedProduct.name, 25, yPosition);
    doc.text(`${selectedProduct.quantity}`, 75, yPosition, { align: "center" });
    doc.text(`${amount.toFixed(2) - gstAmount}`, 125, yPosition, {
      align: "right",
    });
    doc.text(`${amount.toFixed(2) - gstAmount}`, 180, yPosition, { align: "right" });
    yPosition += 15;

    // GST and Total Calculation


    yPosition = addNewPageIfNeeded(doc, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal:", 120, yPosition);
    doc.text(`Rs ${amount.toFixed(2) - gstAmount}`, 150, yPosition, { align: "left" });

    yPosition += 10;
    doc.text(`GST (${gstRate}%):`, 120, yPosition);
    doc.text(`Rs ${gstAmount.toFixed(2)}`, 150, yPosition, { align: "left" });

    yPosition += 10;
    doc.setTextColor(255, 69, 0); // Highlighted total
    doc.text("Total Amount:", 120, yPosition);
    doc.text(`Rs ${amount.toFixed(2)}`, 150, yPosition, { align: "left" });

    yPosition += 20;

    // Footer
    yPosition = addNewPageIfNeeded(doc, yPosition);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(105, 105, 105);
    doc.text("Thank you for shopping with us!", 20, yPosition);
    doc.text("Visit us: www.ShivamMart.com", 20, yPosition + 10);

    // Download PDF
    doc.save(`Shivam_Mart_${orderId}_invoice.pdf`);
  };

  // Handle error, loading, and no product selection state
  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        {error}{" "}
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          Back
        </button>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Product Details</h2>
        <p className={styles.error}>
          No product selected. Please go back to the order history.
        </p>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Product Details</h2>

      {/* Order Info Section */}
      <div className={styles.orderInfo}>
        <p>
          <strong>Order ID:</strong> {orderId}
        </p>

        {/* Displaying Shipping Address here */}
        <p>
          <strong>Shipping Address:</strong>
          <br /> Name: {selectedProduct.user_name || "N/A"}
          <br /> Pincode: {selectedProduct.pincode}
          <br /> Village: {selectedProduct.village}
          <br /> District: {selectedProduct.district}
          <br /> State: {selectedProduct.state}
          <br /> Phone Number: {selectedProduct.user_phoneNumber}
        </p>
      </div>

      {/* Tracking Status Section */}
      <div className={styles.trackingStatus}>
        {/* Order Created Step */}
        <div
          className={`${styles.statusStep} ${orderStatus === "Order Created" || orderStatus === "shipped" || orderStatus === "delivered" ? styles.activeStep : ""}`}
        >
          <div
            className={`${styles.stepCircle} ${orderStatus === "Order Created" || orderStatus === "shipped" || orderStatus === "delivered" ? styles.active : ""}`}
          />
          <p className={styles.statusLabel}>Order Created</p>
        </div>
        <div className={styles.line}></div>

        {/* Shipped Step */}
        <div
          className={`${styles.statusStep} ${orderStatus === "shipped" || orderStatus === "delivered" ? styles.activeStep : ""}`}
        >
          <div
            className={`${styles.stepCircle} ${orderStatus === "shipped" || orderStatus === "delivered" ? styles.active : ""}`}
          />
          <p className={styles.statusLabel}>Shipped</p>
        </div>
        <div className={styles.line}></div>

        {/* Delivered Step */}
        <div
          className={`${styles.statusStep} ${orderStatus === "delivered" ? styles.activeStep : ""}`}
        >
          <div
            className={`${styles.stepCircle} ${orderStatus === "delivered" ? styles.active : ""}`}
          />
          <p className={styles.statusLabel}>Delivered</p>
        </div>
      </div>


      {/* Product Card Section */}
      <div className={styles.productCard}>
        <img
          src={selectedProduct.imageUrl || "default-image.jpg"}
          alt={selectedProduct.name || "Product"}
          className={styles.productImage}
        />
        <div className={styles.productDetails}>
          <h4>{selectedProduct.name || "Unnamed Product"}</h4>
          <p>Price: ₹{selectedProduct.price || "N/A"}</p>
          <p>Quantity: {selectedProduct.quantity || 0}</p>
          <p>
            Total: ₹{selectedProduct.price * selectedProduct.quantity || "N/A"}
          </p>
        </div>
      </div>

      {/* Download Invoice Button */}
      <button className={styles.downloadButton} onClick={generateInvoice}>
        Download Invoice
      </button>

      <button className={styles.downloadButton} onClick={() => navigate(-1)}>
        Back to Order History
      </button>
    </div>
  );
};

export default OrderDetails;
