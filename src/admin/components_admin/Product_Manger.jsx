import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/ProductManager.module.css";

function ProductManager() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([])
  const [selectedMainOption, setSelectedMainOption] = useState("All Products");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // New state for sorting order
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    subcategory: "",
    imageUrl: "",
    description: "",
    price: "",
    quantity: "",
    specifications: {},
  });
  const [editProduct, setEditProduct] = useState({
    _id: "",
    category: "",
    subcategory: "",
    name: "",
    imageUrl: "",
    description: "",
    price: 0,
    quantity: 1,
    specifications: {},
  });


  useEffect(() => {
    fetchCategories()
    fetchProducts(); // Fetch all products when the component is mounted
  }, [editProduct]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/gPbyCatogeries-all/All`
      );
      console.log(response.data.cat);
      setSubCategories(response.data.cat || []);
      setCategories(response.data.c_cat || [])
    } catch (error) {
      console.error("Error fetching categories:", error);
      setSubCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/products-all`
      );
      console.log(response.data.products);
      setProducts(sortProducts(response.data.products)); // Sort products after fetching
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const fetchProductsByCategory = async (category) => {
    try {
      const category_get = category
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/gP/bycategories/${category_get}`
      );
      setProducts(sortProducts(response.data || [])); // Sort products after fetching
    } catch (error) {
      console.error("Error fetching products by category:", error);
      setProducts([]);
    }
  };

  const sortProducts = (products) => {
    return products.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price; // Ascending order
      } else {
        return b.price - a.price; // Descending order
      }
    });
  };

  const handleMainOptionChange = (option) => {
    setSelectedMainOption(option);
    setSelectedCategory(""); // Reset selected category

    if (option === "All Products") {
      fetchProducts(); // Fetch all products if "All Products" is selected
    } else if (option === "Categories") {
      fetchCategories(); // Fetch categories when "Categories" is selected
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchProductsByCategory(category); // Fetch products based on selected category
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/deleteProducts/${productId}`,

      );
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  const openDialog = (productId) => {
    setSelectedProductId(productId);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedProductId(null);
  };

  const confirmDelete = () => {
    if (selectedProductId) {
      handleDelete(selectedProductId);
      closeDialog();
    }
  };

  const handleEdit = async (productId) => {
    console.log(`edit:${productId}`);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/products/${productId}`);

      console.log(`response_edit:${JSON.stringify(response.data)}`);

      // Extract product data properly
      const productData = response.data.product;

      // Convert specifications Map to a normal object if necessary
      const formattedSpecifications =
        productData.specifications instanceof Map
          ? Object.fromEntries(productData.specifications)
          : productData.specifications;

      setEditProduct({
        ...productData,
        specifications: formattedSpecifications, // Ensure specifications is a normal object
      });

      setIsEditModalOpen(true);
      console.log(`edit response:${JSON.stringify(editProduct)}`)
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };


  // const handleFieldEdit = (field) => {
  //   setEditableFields({ ...editableFields, [field]: true });
  // };

  // const handleEditChange = (e, key, subKey = null) => {
  //   setEditProduct((prev) => {
  //     const newValue = e.target.value;

  //     if (subKey) {
  //       return {
  //         ...prev,
  //         [key]: {
  //           ...prev[key],
  //           [subKey]: newValue, // Update nested object field
  //         },
  //       };
  //     } else {
  //       return { ...prev, [key]: newValue }; // Update normal field
  //     }
  //   });
  // };



  const handleEditChange = (e, key, subKey = null) => {
    const newValue = e.target.value;

    setEditProduct((prev) => {
      if (subKey) {
        return {
          ...prev,
          specifications: {
            ...prev.specifications,
            [subKey]: newValue,
          },
        };
      } else {
        return {
          ...prev,
          [key]: newValue,
        };
      }
    });
  };

  const handleEditSpecification = (oldKey, newKey, newValue) => {
    setEditProduct((prev) => {
      const updatedSpecifications = { ...prev.specifications };

      // Check if the key is actually being changed
      if (oldKey !== newKey) {
        // Preserve existing value and avoid unnecessary re-renders
        updatedSpecifications[newKey] = newValue;
        delete updatedSpecifications[oldKey];
      } else {
        // Just update the value if key remains the same
        updatedSpecifications[oldKey] = newValue;
      }

      return {
        ...prev,
        specifications: updatedSpecifications,
      };
    });
  };

  const handleAddFeature = () => {
    setEditProduct((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [`feature${Object.keys(prev.specifications).length + 1}`]: "",
      },
    }));
  };


  const handleAddFeatureNew = (key = null, value = null) => {
    if (key === null && value === null) {
      // Only add a new feature when the "Add Feature" button is clicked
      setNewProduct((prev) => {
        const newFeatureKey = `feature${Object.keys(prev.specifications).length + 1}`;
        return {
          ...prev,
          specifications: {
            ...prev.specifications,
            [newFeatureKey]: "", // Empty value for new feature
          },
        };
      });
    } else {
      // Update existing feature value
      setNewProduct((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [key]: value,
        },
      }));
    }
  };

  const handleRemoveFeature = (subKey) => {
    setEditProduct((prev) => {
      const updatedSpecifications = { ...prev.specifications };
      delete updatedSpecifications[subKey]; // Remove the specified feature

      return {
        ...prev,
        specifications: updatedSpecifications, // Update state with new specifications
      };
    });
  };
  const handleRemoveFeatureNew = (subKey) => {
    setNewProduct((prev) => {
      const updatedSpecifications = { ...prev.specifications };
      delete updatedSpecifications[subKey]; // Remove the specified feature

      return {
        ...prev,
        specifications: updatedSpecifications, // Update state with new specifications
      };
    });
  };

  const handleAddFeatureNewthing = (subkey) => {
    setNewProduct((prev) => {
      const newFeatureKey = `feature${Object.keys(prev.specifications).length + 1}`;
      return {
        ...prev,
        specifications: {
          ...prev.specifications,
          [newFeatureKey]: "", // Ensure it starts empty
        },
      };
    });
  }


  const handleAddProductSubmit = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/addProduct`,
        newProduct
      );
      setNewProduct({
        name: "",
        category: "",
        subcategory: "",
        imageUrl: "",
        description: "",
        price: "",
        quantity: "",
        specifications: {},
      });
      setIsAddModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleAddProductChange = (e, key) => {
    setNewProduct((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      if (!editProduct._id) {
        console.error("Product ID is missing");
        return;
      }
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/product/update`, editProduct);
      setIsEditModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };


  const handleSortChange = (order) => {
    setSortOrder(order); // Update the sort order
    setProducts(sortProducts([...products])); // Re-sort the products when sort order changes
  };

  return (
    <div className={styles.container}>
      <h1>Product Manager</h1>
      <div onClick={() => setIsAddModalOpen(true)} className={styles.addBtnProduct}>
        Add Product
      </div>

      {/* Main Dropdown for "All Products" or "Categories" */}
      <div className={styles.filters}>
        <select
          value={selectedMainOption}
          onChange={(e) => handleMainOptionChange(e.target.value)}
        >
          <option value="All Products">All Products</option>
          <option value="Categories">Categories</option>
        </select>

        {/* Show categories dropdown only after categories are loaded */}
        {selectedMainOption === "Categories" && categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Select Category</option>
            {subCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        )}

        {/* Sort Dropdown */}
        <select onChange={(e) => handleSortChange(e.target.value)}>
          <option value="">Select order</option>
          <option value="asc">Sort by Price (High to Low)</option>
          <option value="desc">Sort by Price (Low to High)</option>
        </select>
      </div>

      {/* Display Products */}
      <div className={styles.productList}>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <h3>{product.name}</h3>
              <p>Category: {product.subcategory}</p>
              <p>Price: ${product.price}</p>
              <button
                onClick={() => handleEdit(product._id)}
                className={styles.editBtn}
              >
                Edit
              </button>
              <button
                onClick={() => openDialog(product._id)}
                className={styles.deleteBtn}
              >
                Delete
              </button>

            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
      {showDialog && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialogBox}>
            <p>Are you sure you want to delete this product?</p>
            <div className={styles.dialogActions}>
              <button onClick={confirmDelete} className={styles.confirmDelete}>
                Delete
              </button>
              <button onClick={closeDialog} className={styles.cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Edit Product</h2>
            <select
              id="category"
              name="category"
              value={editProduct.category}
              onChange={(e) => handleEditChange(e, "category")}
              className={styles.formSelect}
            >
              <label>category</label>
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {Object.entries(editProduct)
              .filter(([key]) => !["_id", "createdAt", "updatedAt", "category"].includes(key))
              .map(([key, value]) => (
                <div key={key} className={styles.formGroup}>
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>

                  {key === "specifications" && typeof value === "object" ? (
                    <div>
                      {Object.entries(editProduct.specifications).map(([key, value]) => (
                        <div key={key} className={styles.subField}>
                          {/* Editable Key Input */}
                          <input
                            type="text"
                            defaultValue={key} // Prevents constant re-renders
                            onBlur={(e) => handleEditSpecification(key, e.target.value, value)}
                            placeholder="Feature Name"
                          />

                          {/* Editable Value Input */}
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleEditSpecification(key, key, e.target.value)}
                            placeholder="Feature Value"
                          />

                          {/* Remove Button */}
                          <button onClick={() => handleRemoveFeature(key)} className={styles.removeBtn}>
                            Remove
                          </button>
                        </div>
                      ))}


                      <div className={styles.buttonGroup}>
                        <button onClick={handleAddFeature} className={styles.addBtn}>
                          Add Feature
                        </button>

                      </div>
                    </div>
                  ) : (
                    <input
                      type={key === "price" || key === "quantity" ? "number" : "text"}
                      value={value}
                      onChange={(e) => handleEditChange(e, key)}
                    />
                  )}
                </div>
              ))}

            <button onClick={handleEditSubmit} className={styles.saveBtn}>
              Save
            </button>
            <button onClick={() => setIsEditModalOpen(false)} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </div>
      )}


      {isAddModalOpen && (
        <div className={styles.addProductModal}>
          <div className={styles.modalContainer}>
            <h2 className={styles.modalTitle}>Add Product</h2>
            <input
              type="text"
              placeholder="Name"
              value={newProduct.name}
              onChange={(e) => handleAddProductChange(e, "name")}
              className={styles.inputField}
            />

            <select
              id="category"
              name="category"
              value={newProduct.category}
              onChange={(e) => handleAddProductChange(e, "category")}
              className={styles.selectDropdown}
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              id="subcategory"
              name="subcategory"
              value={newProduct.subcategory}
              onChange={(e) => handleAddProductChange(e, "subcategory")}
              className={styles.selectDropdown}
            >
              <option value="">Select SubCategory</option>
              {subCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.imageUrl}
              onChange={(e) => handleAddProductChange(e, "imageUrl")}
              className={styles.inputField}
            />
            <input
              type="text"
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => handleAddProductChange(e, "description")}
              className={styles.inputField}
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => handleAddProductChange(e, "price")}
              className={styles.inputField}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newProduct.quantity}
              onChange={(e) => handleAddProductChange(e, "quantity")}
              className={styles.inputField}
            />

            <div className={styles.specificationsSection}>
              <h3 className={styles.specificationsTitle}>Specifications</h3>
              {Object.entries(newProduct.specifications).map(([key, value]) => (
                <div key={key} className={styles.specificationRow}>
                  <input
                    type="text"
                    defaultValue={key}
                    onBlur={(e) => handleAddFeatureNew(key, e.target.value)}
                    placeholder="Feature Name"
                    className={styles.specInput}
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleAddFeatureNew(key, e.target.value)}
                    placeholder="Feature Value"
                    className={styles.specInput}
                  />
                  <button onClick={() => handleRemoveFeatureNew(key)} className={styles.removeFeatureBtn}>
                    Remove
                  </button>
                </div>
              ))}
              <button onClick={handleAddFeatureNewthing} className={styles.addFeatureBtn}>
                Add Feature
              </button>
            </div>

            <div className={styles.buttonGroup}>
              <button onClick={handleAddProductSubmit} className={styles.saveBtn}>
                Save
              </button>
              <button onClick={() => setIsAddModalOpen(false)} className={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}

export default ProductManager;
