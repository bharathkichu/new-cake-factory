import React, { useEffect, useState } from 'react';
import { FaTrashCan } from "react-icons/fa6";

const ListProduct = () => {
  const [allproducts, setAllproducts] = useState([]);
  const [error, setError] = useState(null);

  // Fetch product data from the backend
  const fetchInfo = async () => {
    try {
      const response = await fetch('https://cake-factory-backend.onrender.com/api/products');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAllproducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchInfo();
  }, []);

  // Remove a product by ID
  const remove_product = async (id) => {
    try {
      const response = await fetch('https://cake-factory-backend.onrender.com/api/products', {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Refresh the product list after deletion
      await fetchInfo();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='p-2 box-border mb-0 rounded-sm w-full mt-5 lg:ml-5'>
      <h4 className='bold-22 p-3'>PRODUCT LIST</h4>
      {error && <p className='text-red-500'>Error: {error}</p>}
      <div className='max-h-[77vh] overflow-auto px-4 text-center'>
        <table className='w-full mx-auto'>
          <thead>
            <tr className='bg-container bold-16 sm:regular-20 text-start py-12'>
              <th className='p-2'>Products</th>
              <th className='p-2'>Title</th>
              <th className='p-2'>Old Price</th>
              <th className='p-2'>New Price</th>
              <th className='p-2'>Category</th>
              <th className='p-2'>Remove</th>
            </tr>
          </thead>
          <tbody>
            {allproducts.map((product, i) => (
              <tr key={i} className='border-b border-amber-950 text-gray-90 p-6'>
                <td className='flexCenter my-2'>
                  <img
                    src={product.image}
                    alt={product.name}
                    height={55}
                    width={55}
                    className='rounded-lg ring-1 ring-yellow-900'
                  />
                </td>
                <td><div className='line-clamp-3'>{product.name}</div></td>
                <td>₹{product.old_price}.00</td>
                <td>₹{product.new_price}.00</td>
                <td>{product.category}</td>
                <td>
                  <div className='bold-18 pl-6 sm:pl-14 cursor-pointer'>
                    <FaTrashCan onClick={() => remove_product(product.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListProduct;