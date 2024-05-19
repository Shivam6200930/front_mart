import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './addItems.css' 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ProductForm = ({ onAddProduct }) => {
 const Navigate=useNavigate()
  const [product, setProduct] = useState({
    name: '',
    imageUrl: '',
    description: '',
    price: '',
    quantity: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct(product);
    setProduct({
      name: '',
      imageUrl: '',
      description: '',
      price: '',
      quantity: '',
    });
  };
 
  const add_product= async()=>{
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/product`, product,{withCredentials: true})
    .then(function () {
      toast.success("Product added successfully")
      Navigate('/admin')
    }).catch(function (err) {
      toast.error("Product not added")
       console.log(err)
    })
  }

  return (
     <div className="container">
    <form onSubmit={handleSubmit}>
      <h1>ADD ITEMS DETAILS</h1><hr/>
      <label>
        Name:
        <input type="text" name="name" value={product.name} onChange={handleInputChange}  />
      </label>
      <br />
      <label  >
        Image URL:
        <input type="text" name="imageUrl" value={product.imageUrl} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Description:
        <textarea name="description" value={product.description} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Price:
        <input type="number" name="price" value={product.price} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Quantity:
        <input type="number" name="quantity" value={product.quantity} onChange={handleInputChange} />
      </label>
      <br />
      <div className="but">
      <button onClick={add_product} type="submit">Add Product</button>
      <button onClick={()=>Navigate('/admin')}>Homepage</button>
      </div>
    </form>
    <ToastContainer position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ProductForm;
