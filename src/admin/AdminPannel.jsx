import { useNavigate } from "react-router-dom";
import styles from "./css/AdminPannel.module.css";

const AdminPanel = () => {
    const navigate = useNavigate();  

    return (
        <div className={styles.container}>
            
            <div className={styles.content}>
                <h1>Welcome to Admin Panel</h1>
                <p>Select an option from the sidebar to manage products or orders.</p>
            </div>
            {/* <div className={styles.sidebar}>
                <h2>Admin Panel</h2>
                <ul>
                    <li>
                        <button onClick={() => navigate('/products_manger')}>
                            Manage Products
                        </button>
                    </li>
                    <li>
                        <button onClick={() => navigate('/order_manger')}>
                            Manage Orders
                        </button>
                    </li>
                </ul>
            </div> */}
            
        </div>
    );
};

export default AdminPanel;
