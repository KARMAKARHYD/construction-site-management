import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WorkerTaskView from './WorkerTaskView';
import SupervisorTaskView from './SupervisorTaskView';
import StorekeeperMaterialView from './StorekeeperMaterialView';
import ManagerPaymentView from './ManagerPaymentView';
import ManagerContractView from './ManagerContractView';
import TimekeeperAttendanceView from './TimekeeperAttendanceView';
import NotificationList from './NotificationList';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setError('No token found, please log in.');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/users/user', {
          headers: {
            'x-auth-token': token
          }
        });
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.msg || 'Failed to fetch user data.');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Please log in to view the dashboard.</div>;
  }

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <h3>Your Role: {user.role}</h3>
      <NotificationList />

      {/* Render content based on user role */}
      {user.role === 'Manager' && (
        <div>
          <h4>Manager Dashboard</h4>
          <ManagerPaymentView />
          <ManagerContractView />
        </div>
      )}

      {user.role === 'Supervisor' && (
        <div>
          <h4>Supervisor Dashboard</h4>
          <SupervisorTaskView />
        </div>
      )}

      {user.role === 'Subcontractor' && (
        <div>
          <h4>Subcontractor Dashboard</h4>
          {/* Subcontractor specific content */}
        </div>
      )}

      {user.role === 'Worker' && (
        <div>
          <h4>Worker Dashboard</h4>
          <WorkerTaskView />
        </div>
      )}

      {user.role === 'Storekeeper' && (
        <div>
          <h4>Storekeeper Dashboard</h4>
          <StorekeeperMaterialView />
        </div>
      )}

      {user.role === 'Timekeeper' && (
        <div>
          <h4>Timekeeper Dashboard</h4>
          <TimekeeperAttendanceView />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
