import React, { useState, useEffect } from 'react';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [watch, setWatch] = useState([]);
  const [laptop, setLaptop] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  const carouselImages = [
    "https://static.vecteezy.com/system/resources/thumbnails/004/707/493/small/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg",
    "https://static.vecteezy.com/system/resources/thumbnails/006/828/785/small/paper-art-shopping-online-on-smartphone-and-new-buy-sale-promotion-pink-backgroud-for-banner-market-ecommerce-women-concept-free-vector.jpg",
    "https://static.vecteezy.com/system/resources/thumbnails/004/299/815/small/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg",
    "https://static.vecteezy.com/system/resources/thumbnails/004/591/189/small/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-free-vector.jpg",
  ];

  const fetchCategoriesMobile = async () => {
    let searchQuery = 'Mobile';
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/search?q=${searchQuery}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching mobile categories:', error);
    }
  };

  const fetchCategoriesWatch = async () => {
    let searchQuery = 'Watch';
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/search?q=${searchQuery}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setWatch(data || []);
    } catch (error) {
      console.error('Error fetching watch categories:', error);
    }
  };

  const fetchCatgorieLaptop = async () => {
    let searchQuery = 'Laptop';
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/search?q=${searchQuery}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setLaptop(data || []);
    } catch (error) {
      console.error('Error fetching watch categories:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategoriesMobile();
      await fetchCategoriesWatch();
      await fetchCatgorieLaptop();
    };

    fetchData();

    const interval = setInterval(() => {
      nextImage();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % carouselImages.length);
  };

  const handleDotClick = (index) => {
    setCurrentImage(index);
  };

  const handleCategoryClick = (category) => {
    navigate(`/view`, { state: category });
  };

  const round = (searchQuery) => {
    navigate(`/search_products/?q=${searchQuery}`);
  };

  return (
    <div className="Homepage-container">
      {/* Carousel Section */}
      <div className="carousel-container">
        <div className="carousel">
          <img
            src={carouselImages[currentImage]}
            alt={`slide-${currentImage}`}
            height="100%"
            width="100%"
          />
        </div>
        {/* Dots Section */}
        <div className="carousel-dots">
          {carouselImages.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentImage === index ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Mobiles Section */}
      <div className="sect">
        <div className="main-header">
          <div className="text"><h2>Mobiles</h2></div>
          <div className="rounded-div" onClick={() => { round('mobile') }}>
            &#8594;
          </div>
        </div>

        <div className="all-deals-sale">
          <div className="products-container">
            {categories?.data?.length > 0 ? (
              categories.data.slice(0, 10).map((category) => (
                <div
                  className="product-item"
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                >
                  <img
                    src={category.imageUrl || 'https://via.placeholder.com/150'}
                    alt={category.name || 'Category'}
                    height="150px"
                    width="150px"
                  />
                  <br />
                  <h2>{category.name || 'Unnamed Category'}</h2>
                  <h3>₹{category.price || '0.00'}</h3>
                  <p>{category.description}</p>
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        </div>
      </div>

      {/* Watches Section and laptop section*/}
      <div className="watch-laptop">
        <div className="sect-watch">
          <div className="main-header">
            <div className="text"><h2>Watches</h2></div>
            <div className="rounded-div" onClick={() => { round('Watch') }}>
              &#8594;
            </div>
          </div>

          <div className="all-deals-sale-watch">
            <div className="products-container-watch">
              {watch?.data?.length > 0 ? (
                watch.data.slice(0, 2).filter((_,index) => index !== 9).map((item) => (
                  <div
                    className="product-item-watch"
                    key={item.id}
                    onClick={() => handleCategoryClick(item)}
                  >
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/150'}
                      alt={item.name || 'Watch'}
                      height="150px"
                      width="150px"
                    />
                    <br />
                    <h2>{item.name || 'Unnamed Watch'}</h2>
                    <h3>₹{item.price || '0.00'}</h3>
                    <p>{item.description}</p>
                  </div>
                ))
              ) : (
                <p>No products available</p>
              )}
            </div>
          </div>
        </div>


        <div className="sect-watch">
          <div className="main-header">
            <div className="text"><h2>Laptop</h2></div>
            <div className="rounded-div" onClick={() => { round('Watch') }}>
              &#8594;
            </div>
          </div>

          <div className="all-deals-sale-watch">
            <div className="products-container-watch">
              {laptop?.data?.length > 0 ? (
                laptop.data.slice(0, 5).map((item) => (
                  <div
                    className="product-item-watch"
                    key={item.id}
                    onClick={() => handleCategoryClick(item)}
                  >
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/150'}
                      alt={item.name || 'Watch'}
                      height="150px"
                      width="150px"
                    />
                    <br />
                    <h2>{item.name || 'Unnamed Watch'}</h2>
                    <h3>₹{item.price || '0.00'}</h3>
                    <p>{item.description}</p>
                  </div>
                ))
              ) : (
                <p>No products available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
