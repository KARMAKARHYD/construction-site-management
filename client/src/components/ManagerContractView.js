import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManagerContractView({ selectedSite }) {
  const [subcontractors, setSubcontractors] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newContractSubcontractor, setNewContractSubcontractor] = useState('');
  const [newContractType, setNewContractType] = useState('with_material');
  const [newContractRate, setNewContractRate] = useState(0);
  const [newContractStartDate, setNewContractStartDate] = useState('');
  const [newContractEndDate, setNewContractEndDate] = useState('');
  const [newContractMilestones, setNewContractMilestones] = useState([]);

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
      const [subcontractorsRes, contractsRes] = await Promise.all([
        axios.get('http://localhost:5000/subcontractors', config),
        axios.get('http://localhost:5000/contracts', config)
      ]);
      setSubcontractors(subcontractorsRes.data);
      setContracts(contractsRes.data);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.msg || 'Failed to fetch data.');
      setLoading(false);
    }
  };

  const handleAddContract = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/contracts/add', {
        subcontractor: newContractSubcontractor,
        contractType: newContractType,
        rate: newContractRate,
        startDate: newContractStartDate,
        endDate: newContractEndDate,
        milestones: newContractMilestones
      }, {
        headers: { 'x-auth-token': token }
      });
      alert('Contract added successfully!');
      setNewContractSubcontractor('');
      setNewContractType('with_material');
      setNewContractRate(0);
      setNewContractStartDate('');
      setNewContractEndDate('');
      setNewContractMilestones([]);
      fetchData();
    } catch (err) {
      setError(err.response.data.msg || 'Failed to add contract.');
      console.error(err.response.data);
    }
  };

  const handleAddMilestone = () => {
    setNewContractMilestones([...newContractMilestones, { description: '', dueDate: '', paymentPercentage: 0 }]);
  };

  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = [...newContractMilestones];
    updatedMilestones[index][field] = value;
    setNewContractMilestones(updatedMilestones);
  };

  if (loading) {
    return <div>Loading contract data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Subcontractor Contract Management</h3>

      <h4>Add New Contract</h4>
      <form onSubmit={handleAddContract}>
        <div>
          <label>Subcontractor:</label>
          <select value={newContractSubcontractor} onChange={(e) => setNewContractSubcontractor(e.target.value)} required>
            <option value="">Select Subcontractor</option>
            {subcontractors.map(sub => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Contract Type:</label>
          <select value={newContractType} onChange={(e) => setNewContractType(e.target.value)}>
            <option value="with_material">With Material</option>
            <option value="without_material">Without Material</option>
          </select>
        </div>
        <div>
          <label>Rate:</label>
          <input type="number" value={newContractRate} onChange={(e) => setNewContractRate(Number(e.target.value))} required />
        </div>
        <div>
          <label>Start Date:</label>
          <input type="date" value={newContractStartDate} onChange={(e) => setNewContractStartDate(e.target.value)} required />
        </div>
        <div>
          <label>End Date:</label>
          <input type="date" value={newContractEndDate} onChange={(e) => setNewContractEndDate(e.target.value)} required />
        </div>
        <h4>Milestones</h4>
        {newContractMilestones.map((milestone, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <div>
              <label>Description:</label>
              <input type="text" value={milestone.description} onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)} />
            </div>
            <div>
              <label>Due Date:</label>
              <input type="date" value={milestone.dueDate} onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)} />
            </div>
            <div>
              <label>Payment Percentage:</label>
              <input type="number" value={milestone.paymentPercentage} onChange={(e) => handleMilestoneChange(index, 'paymentPercentage', Number(e.target.value))} />
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddMilestone}>Add Milestone</button>
        <br />
        <button type="submit">Add Contract</button>
      </form>

      <h4>Existing Contracts</h4>
      {contracts.length === 0 ? (
        <p>No contracts added yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Subcontractor</th>
              <th>Type</th>
              <th>Rate</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Milestones</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(contract => (
              <tr key={contract._id}>
                <td>{contract.subcontractor ? contract.subcontractor.name : 'N/A'}</td>
                <td>{contract.contractType}</td>
                <td>{contract.rate}</td>
                <td>{new Date(contract.startDate).toLocaleDateString()}</td>
                <td>{new Date(contract.endDate).toLocaleDateString()}</td>
                <td>{contract.status}</td>
                <td>
                  <ul>
                    {contract.milestones.map((milestone, index) => (
                      <li key={index}>
                        {milestone.description} (Due: {new Date(milestone.dueDate).toLocaleDateString()}, {milestone.paymentPercentage}%)
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManagerContractView;
