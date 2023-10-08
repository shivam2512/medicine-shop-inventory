import React, { useState, useEffect, useRef } from 'react';
import AddMedicineForm from './AddMedicineForm';
import MedicineInventory from './MedicineInventory';
import Invoice from './Invoice';
import jsPDF from 'jspdf';

function App() {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const pdfRef = useRef();

  useEffect(() => {
    fetchMedicinesFromAPI();
  }, []);

  const fetchMedicinesFromAPI = async () => {
    try {
      const response = await fetch('https://crudcrud.com/api/c23d1b44dbe44913abe68eed525fca97/medicines');
      if (response.ok) {
        const data = await response.json();
        setMedicines(data);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const addMedicineToInventory = (newMedicine) => {
    fetch('https://crudcrud.com/api/c23d1b44dbe44913abe68eed525fca97/medicines', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMedicine),
    })
      .then((response) => response.json())
      .then((data) => {
        setMedicines([...medicines, data]);
      })
      .catch((error) => {
        console.error('Error adding medicine:', error);
      });
  };

  const addToCart = (medicine) => {
    const updatedInventory = medicines.map((item) => {
      if (item.id === medicine.id && item.quantity > 0) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setMedicines(updatedInventory);
    setCart([...cart, medicine]);
  };

  const removeFromCart = (medicine) => {
    const updatedCart = cart.filter((item) => item.id !== medicine.id);
    const updatedInventory = medicines.map((item) => {
      if (item.id === medicine.id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);
    setMedicines(updatedInventory);
  };

  const generateInvoice = () => {
    setShowInvoice(true);
  };

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    doc.text('Invoice', 10, 10);
    
    // Add invoice details here
    doc.text('Cart Items:', 10, 20);
    cart.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} - $${item.price}`, 10, 30 + (index * 10));
    });

    doc.text(`Total: $${calculateTotal()}`, 10, 40 + (cart.length * 10));

    // Save the PDF
    doc.save('invoice.pdf');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div>
      <h1>Medicine Shop Inventory</h1>
      <AddMedicineForm addMedicine={addMedicineToInventory} />
      <MedicineInventory
        medicines={medicines}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />
      {cart.length > 0 && (
        <div>
          <h2>Shopping Cart</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((medicine) => (
                <tr key={medicine.id}>
                  <td>{medicine.name}</td>
                  <td>${medicine.price}</td>
                  <td>
                    <button onClick={() => removeFromCart(medicine)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Total: ${calculateTotal()}</p>
          <button onClick={generateInvoice}>Generate Invoice</button>
        </div>
      )}
      {showInvoice && (
        <div>
          <h2>Invoice</h2>
          <button onClick={handleDownloadInvoice}>Download Invoice</button>
          <div ref={pdfRef}>
            <Invoice cart={cart} total={calculateTotal()} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
