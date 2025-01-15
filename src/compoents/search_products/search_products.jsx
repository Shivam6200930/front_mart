import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './search_products.css';
import { toast } from 'react-toastify';

const SearchProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('q') || '';

    // Helper to calculate delivery date
    const getDeliveryDate = () => {
        const deliveryDays = Math.floor(Math.random() * 5) + 1; // Random value between 1 and 5
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
        return deliveryDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    useEffect(() => {
        const fetchProducts = async () => {
            if (!searchQuery) {
                console.log("enter the search query")
                toast.info('Enter a search query to find products.');
                setProducts([]);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/users/search?q=${searchQuery}`
                );

                const formattedProducts = response.data.data.map((product) => {
                    const discountPercentage = Math.floor(Math.random() * 41) + 10; // Random discount between 10% and 50%
                    const cutPrice = (product.price * (1 + discountPercentage / 100)).toFixed(2);

                    return {
                        ...product,
                        features: [
                            product.specifications?.Feature1 || 'N/A',
                            product.specifications?.Feature2 || 'N/A',
                            product.specifications?.Feature3 || 'N/A',
                        ],
                        cutPrice,
                        discountPercentage,
                        deliveryDate: getDeliveryDate(),
                    };
                });
                

                setProducts(formattedProducts);
                toast.success(`Results found for: ${searchQuery}`);
                console.log("Fetched products:", formattedProducts);
            } catch (err) {
                console.error('Error fetching products:', err);
                toast.error('Failed to fetch products. Please try again.');
                setError('Failed to fetch products. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        
console.log('Final Products State:', products);

    }, [searchQuery]);

    return (
        <div className="unique-home-container">
            {loading && (
                <div className="unique-loading-container">
                    <div className="unique-loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            )}

            {error && <div className="unique-error-message">{error}</div>}

            <main className="unique-product-container">
                {products.length > 0 ? (
                    <div className="unique-product-list">
                        {products.map((product) => (
                            <div
                                className="unique-product-item"
                                key={product._id || product.name + Math.random()}
                                onClick={() => navigate('/view', { state: product })}
                            >
                                <img
                                    className="unique-product-image"
                                    src={product.imageUrl || '/placeholder.png'}
                                    alt={product.name}
                                    onError={(e) => { e.target.src = '/placeholder.png'; }}
                                />
                                <div className="unique-product-info">
                                    <div className="unique-product-speci">
                                        <h3>{product.name}</h3>
                                        <ul className="unique-product-features">
                                            {product.features.slice(0, 3).map((feature, index) => (
                                                <li key={`${product._id}-${index}`}>&#8226; {feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="unique-product-price-details">
                                        <p className="unique-original-price"><h4>Price₹{product.price.toFixed(2)}</h4></p>
                                        <div className="unique-cut-discount">
                                            <div className="unique-cut-price">₹{product.cutPrice}</div>
                                            <div className="unique-discount">{product.discountPercentage}% off</div>
                                        </div>
                                        <div className="unique-delivery-items">
                                            <p>Delivery by:<h5>{product.deliveryDate}</h5></p>
                                            <p className="unique-offer">Upto ₹2000 off on Exchange</p>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading && <p className="unique-no-results">No products found. Try a different query.</p>
                )}
            </main>
        </div>
    );
};

export default SearchProducts;
