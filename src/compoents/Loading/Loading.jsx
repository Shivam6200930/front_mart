import React from "react";
import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingAnimation}></div>
      <p className={styles.loadingText}>Loading, please wait...</p>
    </div>
  );
};

export default Loading;