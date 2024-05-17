import React, { useState, useEffect } from 'react';
import './Homepage_admin.css';
function Homepage() {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "https://static.vecteezy.com/system/resources/thumbnails/004/707/493/small/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg",
    "https://static.vecteezy.com/system/resources/thumbnails/006/828/785/small/paper-art-shopping-online-on-smartphone-and-new-buy-sale-promotion-pink-backgroud-for-banner-market-ecommerce-women-concept-free-vector.jpg",
    "https://static.vecteezy.com/system/resources/thumbnails/004/299/815/small/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg",
    "https://static.vecteezy.com/system/resources/thumbnails/004/591/189/small/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-free-vector.jpg"
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextImage();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [currentImage]);

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((currentImage - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="Homepage-container">
        <div className="all-catogaries">
          <div className="catogaries">
            <div className="cat-gor">
              <img src="https://rukminim2.flixcart.com/flap/80/80/image/29327f40e9c4d26b.png?q=100" alt="Gorcery"></img>
              <p>Gorcery</p>
            </div>
            <div className="mobile">
              <img src="https://rukminim1.flixcart.com/flap/490/460/image/42f9a853f9181279.jpg?q=20" alt="mobile" height="120px" width="120px"></img>

            </div>
            <div className="cat-col">
              <img src="https://rukminim1.flixcart.com/flap/490/460/image/f07bb3e1c1392b47.jpg?q=20" alt="clothes" height="120px" width="120px" />

            </div>
            <div className="smart">
              <img src="https://rukminim1.flixcart.com/flap/490/460/image/913e96c334d04395.jpg?q=20" alt="smart" height="120px" width="120px" />
            </div>
            <div className="furniture">
              <img src="https://rukminim1.flixcart.com/flap/80/80/image/ab7e2b022a4587dd.jpg?q=100" alt="furniture" height="80px" width="80px" />
              <p>Furnitures</p>
            </div>
            <div className="furniture">
              <img src="https://rukminim1.flixcart.com/fk-p-flap/80/80/image/0139228b2f7eb413.jpg?q=100" alt="Applicents" height="80px" width="80px" />
              <p>Applicants</p>
            </div>
            <div className="furniture">
              <img src="https://rukminim1.flixcart.com/flap/80/80/image/71050627a56b4693.png?q=100" alt="Travel" height="80px" width="80px" />
              <p>Travel</p>
            </div>
            <div className="furniture">
              <img src="https://rukminim1.flixcart.com/flap/80/80/image/dff3f7adcf3a90c6.png?q=100" alt="Toys" height="80px" width="80px" />
              <p>Toys</p>
            </div>
            <div className="furniture">
              <img src="https://m.media-amazon.com/images/I/916GGqnsG+L._AC_UY218_.jpg" alt="camera" height="80px" width="80px" />
              <p>Camers</p>
            </div>

          </div>
        </div>

        <div className="image-all">
          <div id="image-container">
            <img
              src={images[currentImage]}
              alt={`img${currentImage}`}
              height="50%"
              width="100%"

            />
          </div>
        </div>
        <div className="all-deals-sale">
          <div className="best-deals">
            <div className="up-head">
              <h2>Best Electronics</h2>
              <div className="b-ar">&#10095;</div>
            </div>

            <div className="best-electronics">
              <div className="best-camera">
                <img src="https://m.media-amazon.com/images/I/916GGqnsG+L._AC_UY218_.jpg" alt="camera" height="150px" width="150px" />
                <h2>Camera</h2>
                <h3>Shoap Now!</h3>
              </div>
              <div className="speaker-pic">
                <img src="https://rukminim2.flixcart.com/image/612/612/xif0q/projector/k/f/0/zeb-pixaplay-22-green-16-zeb-pixaplay-22-green-led-zebronics-original-imagpqgasyrg2gzv.jpeg?q=70" alt="speaker" height="150px" width="150px" />
                <h2>Speaker</h2>
                <h3>starting from  &#x20B9;999.</h3>
              </div>
              <div className="card-pic">
                <img src="https://rukminim2.flixcart.com/image/612/612/xif0q/external-hard-drive/ssd/q/1/y/sdssde61-1t00-g25m-sandisk-original-imagsgpzfjagzdqf.jpeg?q=70" alt="disk" height="150px" width="150px" />
                <h2>sandisk</h2>
                <h3>Shoap Now!</h3>
              </div>
              <div className="monitor">
                <img src="https://rukminim2.flixcart.com/image/312/312/xif0q/monitor/t/q/r/g24e-20-full-hd-24-2023-66d7gar1in-lenovo-original-imagq53zdnffu2pz.jpeg?q=70" alt="monitor" height="150px" width="150px" />
                <h2>Monier</h2>
                <h3> From &#x20B9;11999</h3>
              </div>
              <div className="printer">
                <img src="https://rukminim2.flixcart.com/image/612/612/xif0q/printer/v/f/q/1008a-hp-original-imagpzkkyazzc7tf.jpeg?q=70" alt="printer" height="150px" width="150px" />
                <h2>Hp Printer</h2>
                <h3>From  &#x20B9;13999</h3>
              </div>
            </div>
          </div>

        </div>
        <div className="toy-f-m">
          <div className="indiual">
            <div className="up-head">
              <h2>Best Toys & More</h2>
              <div className="b-ar">&#10095;</div>
            </div>
            <div className="sho">
              <div className="st">
                <img src="https://rukminim2.flixcart.com/image/612/612/kh0vonk0/art-set/h/h/6/pencil-smart-kit-doms-original-imafx4qrxrhv82bn.jpeg?q=70" alt="satasniory" height="150px" width="150px" />
                <h2>Statsniory</h2>
                <h3>From &#x20B9;85</h3>
              </div>
              <div className="st">
                <img src="https://rukminim2.flixcart.com/image/612/612/xif0q/electric-cycle/c/n/f/bolton-electric-cycle-for-men-women-ages-15-range-35-km-li-ion-original-imagxn5ewecmptsk.jpeg?q=70" alt="bicycle" height="150px" width="150px" />
                <h2>Bicycle</h2>
                <h3>From &#x20B9;1565</h3>
              </div>
              <div className="st">
                <img src="https://rukminim2.flixcart.com/image/416/416/kw85bww0/action-figure/p/9/q/6-death-note-anime-action-figure-19-cm-for-home-decors-office-original-imag8ymahvqj4kk3.jpeg?q=70&crop=false" alt="toys" height="150px" width="150px" />
                <h2>Toys</h2>
                <h3>From &#x20B9;185</h3>
              </div>
              <div className="st">
                <img src="https://rukminim2.flixcart.com/image/612/612/ks99aq80/stuffed-toy/f/g/q/vtb-retail-3-feet-teddy-bear-for-valentine-anniversary-birthday-original-imag5uwbtftsdywm.jpeg?q=70" alt="teddy" height="150px" width="150px" />
                <h2>Teddy</h2>
                <h3>From &#x20B9;99</h3>
              </div>
              <div className="st">
                <img src="https://rukminim2.flixcart.com/image/612/612/remote-control-toy/r/d/b/toy-car-like-ferrari-with-open-and-closed-doors-with-remote-original-imaebrkhhycnwyzj.jpeg?q=70" alt="control car" height="150px" width="150px" />
                <h2>control car</h2>
                <h3>From &#x20B9;85</h3>
              </div>
              <div className="st">
                <img src="https://rukminim2.flixcart.com/image/612/612/kapoo7k0/coffee/a/p/m/200-classic-stabilo-200g-pouch-instant-coffee-pouch-nescafe-original-imafs7xhajfwuzdz.jpeg?q=70" alt="Cofee" height="150px" width="150px" />
                <h2>Cofee</h2>
                <h3>Discount upto 70%</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;
