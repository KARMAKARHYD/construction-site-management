import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SiteManagementView() {
  const [sites, setSites] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteLocation, setNewSiteLocation] = useState('');
  const [newSiteManager, setNewSiteManager] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in.');
      setLoading(false);
      return;
    }

    try {
      const [sitesRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/sites', { headers: { 'x-auth-token': token } }),
        axios.get('http://localhost:5000/users/user', { headers: { 'x-auth-token': token } }) // Fetch current user to get manager ID
      ]);
      setSites(sitesRes.data);
      // Assuming only Managers can manage sites, and the current user is a manager
      setManagers([usersRes.data]); 
      setNewSiteManager(usersRes.data._id); // Set default manager to current user
      setLoading(false);
    } catch (err) {
      setError(err.response.data.msg || 'Failed to fetch data.');
      setLoading(false);
    }
  };

  const handleAddSite = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/sites/add', {
        name: newSiteName,
        location: newSiteLocation,
        manager: newSiteManager
      }, {
        headers: { 'x-auth-token': token }
      });
      alert('Site added successfully!');
      setNewSiteName('');
      setNewSiteLocation('');
      fetchData();
    } catch (err) {
      setError(err.response.data.msg || 'Failed to add site.');
      console.error(err.response.data);
    }
  };

  if (loading) {
    return <div>Loading site data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Site Management</h3>

      <h4>Add New Site</h4>
      <form onSubmit={handleAddSite}>
        <div>
          <label>Site Name:</label>
          <input type="text" value={newSiteName} onChange={(e) => setNewSiteName(e.target.value)} required />
        </div>
        <div>
          <label>Location:</label>
          <input type="text" value={newSiteLocation} onChange={(e) => setNewSiteLocation(e.target.value)} required />
        </div>
        {/* Manager selection can be hidden if only current manager can add sites */}
        <div>
          <label>Manager:</label>
          <select value={newSiteManager} onChange={(e) => setNewSiteManager(e.target.value)} required>
            {managers.map(manager => (
              <option key={manager._id} value={manager._id}>{manager.username}</option>
            ))}
          </select>
        </div>
        <button type="submit">Add Site</button>
      </form>

      <h4>Existing Sites</h4>
      {sites.length === 0 ? (
        <p>No sites added yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Manager</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sites.map(site => (
              <tr key={site._id}>
                <td>{site.name}</td>
                <td>{site.location}</td>
                <td>{site.manager ? site.manager.username : 'N/A'}</td>
                <td>{site.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SiteManagementView;
