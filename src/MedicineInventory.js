import React from 'react';

function MedicineInventory({ medicines, addToCart, removeFromCart }) {
  return (
    <div>
      <h2>Medicine Inventory</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => (
            <tr key={medicine.id}>
              <td>{medicine.name}</td>
              <td>{medicine.description}</td>
              <td>${medicine.price}</td>
              <td>{medicine.quantity}</td>
              <td>
                {medicine.quantity > 0 && (
                  <button onClick={() => addToCart(medicine)}>Add to Cart</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MedicineInventory;
