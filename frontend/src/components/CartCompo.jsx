import React from "react";

const CartCompo = ({ item, updateQuantity, removeItem }) => {
  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image} alt={item.food_name} />
      </div>
      <div className="cart-item-details">
        <h3>{item.food_name}</h3>
        <p>Price: ₹{item.price}</p>
        <div className="cart-item-actions">
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
        </div>
        <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
      </div>
    </div>
  );
};

export default CartCompo;
