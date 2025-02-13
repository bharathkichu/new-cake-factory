import React, { createContext, useEffect, useState } from 'react';
// import all_products from '../assets/all_products';

export const ShopContext = createContext(null);

    const getDefaultCart = () =>{
      let cart = {}
      for (let index = 0; index < 300 + 1; index++) {
        cart[index] = 0;
      }
      return cart;
    }

const ShopContextProvider = (props) => {
  
  const [all_products, setAll_products] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());

  useEffect(()=> {
    fetch('https://cake-factory-backend.onrender.com/api/products').then((response)=> response.json()).then((data)=> setAll_products(data));
    if(localStorage.getItem('auth-token')){
      fetch('https://cake-factory-backend.onrender.com/getcart', {
        method : 'POST',
        headers : {
          Accept : 'application/form-data',
          // Accept: 'application/json',
          'auth-token' : `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body : "",
      }).then((response)=> response.json()).then((data)=> setCartItems(data));
    }
  }, [])
  
  const addToCart = (itemId) =>{
    setCartItems((prev)=>({...prev, [itemId] : prev[itemId] +1 }))
    if(localStorage.getItem('auth-token')){
      fetch('https://cake-factory-backend.onrender.com/addtocart', {
        method : 'POST',
        headers : {
          Accept : 'application/json',
          'auth-token' : `${localStorage.getItem('auth-token')}`,
          'Content-Type' : 'application/form-data',
        },
        body : JSON.stringify({"itemId" : itemId}),
      }).then((response)=> response.json()).then((data)=> console.log(data));
    }
  };

  const removeFromCart = (itemId) =>{
    setCartItems((prev)=>({...prev, [itemId] : prev[itemId] -1 }))
    if(localStorage.getItem('auth-token')){
      fetch('https://cake-factory-backend.onrender.com/removefromcart', {
        method : 'POST',
        headers : {
          Accept : 'application/json',
          'auth-token' : `${localStorage.getItem('auth-token')}`,
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify({"itemId" : itemId}),
      }).then((response)=> response.json()).then((data)=> console.log(data));
    }
  };

  const getTotalCartAmount = ()=> {
    let totalAmount = 0;
    for (const item in cartItems) {
      if(cartItems[item]>0) {
        let itemInfo = all_products.find((product)=> product.id === Number(item));
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  }

  const getTotalCartItems = ()=> {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item]>0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  }

  const contextValue = {all_products, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems};

  return (
    <ShopContext.Provider value = {contextValue}>
        {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider;