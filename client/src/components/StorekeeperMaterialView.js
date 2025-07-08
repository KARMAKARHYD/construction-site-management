import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StorekeeperMaterialView({ selectedSite }) {
  const [materials, setMaterials] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newMaterialName, setNewMaterialName] = useState('');
  const [newMaterialUnit, setNewMaterialUnit] = useState('');
  const [newMaterialMinStock, setNewMaterialMinStock] = useState(0);

  const [transactionMaterial, setTransactionMaterial] = useState('');
  const [transactionQuantity, setTransactionQuantity] = useState(0);
  const [transactionType, setTransactionType] = useState('in');
  const [transactionNotes, setTransactionNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedSite]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in.');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { 'x-auth-token': token },
        params: { siteId: selectedSite }
      };
      const [materialsRes, transactionsRes] = await Promise.all([
        axios.get('http://localhost:5000/materials', config),
        axios.get('http://localhost:5000/material_transactions', config)
      ]);
      setMaterials(materialsRes.data);
      setTransactions(transactionsRes.data);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.msg || 'Failed to fetch data.');
      setLoading(false);
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/materials/add', {
        name: newMaterialName,
        unit: newMaterialUnit,
        minStockLevel: newMaterialMinStock
      }, {
        headers: { 'x-auth-token': token }
      });
      alert('Material added successfully!');
      setNewMaterialName('');
      setNewMaterialUnit('');
      setNewMaterialMinStock(0);
      fetchData();
    } catch (err) {
      setError(err.response.data.msg || 'Failed to add material.');
      console.error(err.response.data);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      // Get current user ID for recordedBy
      const userRes = await axios.get('http://localhost:5000/users/user', { headers: { 'x-auth-token': token } });
      const recordedBy = userRes.data._id;

      await axios.post('http://localhost:5000/material_transactions/add', {
        material: transactionMaterial,
        quantity: transactionQuantity,
        type: transactionType,
        recordedBy: recordedBy,
        notes: transactionNotes
      }, {
        headers: { 'x-auth-token': token }
      });

      // Update material stock
      const materialToUpdate = materials.find(mat => mat._id === transactionMaterial);
      if (materialToUpdate) {
        const updatedStock = transactionType === 'in'
          ? materialToUpdate.currentStock + transactionQuantity
          : materialToUpdate.currentStock - transactionQuantity;

        await axios.post(`http://localhost:5000/materials/update/${transactionMaterial}`, {
          currentStock: updatedStock
        }, {
          headers: { 'x-auth-token': token }
        });
      }

      alert('Material transaction added successfully!');
      setTransactionMaterial('');
      setTransactionQuantity(0);
      setTransactionType('in');
      setTransactionNotes('');
      fetchData();
    } catch (err) {
      setError(err.response.data.msg || 'Failed to add transaction.');
      console.error(err.response.data);
    }
  };

  if (loading) {
    return <div>Loading material data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Material Management</h3>

      <h4>Add New Material</h4>
      <form onSubmit={handleAddMaterial}>
        <div>
          <label>Name:</label>
          <input type="text" value={newMaterialName} onChange={(e) => setNewMaterialName(e.target.value)} required />
        </div>
        <div>
          <label>Unit:</label>
          <input type="text" value={newMaterialUnit} onChange={(e) => setNewMaterialUnit(e.target.value)} required />
        </div>
        <div>
          <label>Minimum Stock Level:</label>
          <input type="number" value={newMaterialMinStock} onChange={(e) => setNewMaterialMinStock(Number(e.target.value))} />
        </div>
        <button type="submit">Add Material</button>
      </form>

      <h4>Record Material Transaction</h4>
      <form onSubmit={handleAddTransaction}>
        <div>
          <label>Material:</label>
          <select value={transactionMaterial} onChange={(e) => setTransactionMaterial(e.target.value)} required>
            <option value="">Select Material</option>
            {materials.map(mat => (
              <option key={mat._id} value={mat._id}>{mat.name} ({mat.unit})</option>
            ))}
          </select>
        </div>
        <div>
          <label>Quantity:</label>
          <input type="number" value={transactionQuantity} onChange={(e) => setTransactionQuantity(Number(e.target.value))} required />
        </div>
        <div>
          <label>Type:</label>
          <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
            <option value="in">Stock In</option>
            <option value="out">Stock Out</option>
          </select>
        </div>
        <div>
          <label>Notes:</label>
          <textarea value={transactionNotes} onChange={(e) => setTransactionNotes(e.target.value)}></textarea>
        </div>
        <button type="submit">Record Transaction</button>
      </form>

      <h4>Current Material Stock</h4>
      {materials.length === 0 ? (
        <p>No materials added yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Unit</th>
              <th>Current Stock</th>
              <th>Min Stock Level</th>
            </tr>
          </thead>
          <tbody>
            {materials.map(mat => (
              <tr key={mat._id}>
                <td>{mat.name}</td>
                <td>{mat.unit}</td>
                <td>{mat.currentStock}</td>
                <td>{mat.minStockLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h4>Material Transaction History</h4>
      {transactions.length === 0 ? (
        <p>No transactions recorded yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Material</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Date</th>
              <th>Recorded By</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(trans => (
              <tr key={trans._id}>
                <td>{trans.material ? trans.material.name : 'N/A'}</td>
                <td>{trans.quantity}</td>
                <td>{trans.type}</td>
                <td>{new Date(trans.date).toLocaleDateString()}</td>
                <td>{trans.recordedBy ? trans.recordedBy.username : 'N/A'}</td>
                <td>{trans.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StorekeeperMaterialView;
