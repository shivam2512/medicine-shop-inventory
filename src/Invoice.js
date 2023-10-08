import React from 'react';

function Invoice({ cart, total }) {
  return (
    <div>
      <h2>Invoice</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total: ${total}</p>
    </div>
  );
}

export default Invoice;
