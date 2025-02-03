import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./pagenotfound.module.css";

function PageNotFound() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <motion.div
        className="error-code"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        404
      </motion.div>
      <motion.p
        className="error-message"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Oops! Page Not Found
      </motion.p>
      <motion.p
        className="sub-message"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        You seem to have wandered into unknown territory.
      </motion.p>
      <motion.button
        className="back-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate(role === "user" ? "/" : "/admin")}
      >
        Go Back to Shivam Mart
      </motion.button>
    </div>
  );
}

export default PageNotFound;
