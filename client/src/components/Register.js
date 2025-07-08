import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Subcontractor'); // Default role
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/users/register', { username, password, role });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg || 'Registration failed.');
        console.error(err.response.data);
      } else if (err.request) {
        setError('No response from server. Please check if the server is running.');
        console.error(err.request);
      } else {
        setError('Error: ' + err.message);
        console.error(err.message);
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Subcontractor">Subcontractor</option>
            <option value="Worker">Worker</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Manager">Manager</option>
            <option value="Storekeeper">Storekeeper</option>
            <option value="Timekeeper">Timekeeper</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
