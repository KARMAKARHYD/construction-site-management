import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SiteSelector({ onSelectSite }) {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSite, setSelectedSite] = useState('');

  useEffect(() => {
    const fetchSites = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/sites', {
          headers: {
            'x-auth-token': token
          }
        });
        setSites(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.msg || 'Failed to fetch sites.');
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  const handleChange = (e) => {
    setSelectedSite(e.target.value);
    onSelectSite(e.target.value);
  };

  if (loading) {
    return <div>Loading sites...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <label htmlFor="site-select">Select Site:</label>
      <select id="site-select" value={selectedSite} onChange={handleChange}>
        <option value="">All Sites</option>
        {sites.map(site => (
          <option key={site._id} value={site._id}>{site.name}</option>
        ))}
      </select>
    </div>
  );
}

export default SiteSelector;
