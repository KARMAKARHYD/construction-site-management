import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/notifications', {
        headers: {
          'x-auth-token': token
        }
      });
      setNotifications(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.msg || 'Failed to fetch notifications.');
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/notifications/read/${id}`, {}, {
        headers: {
          'x-auth-token': token
        }
      });
      fetchNotifications(); // Refresh the list
    } catch (err) {
      setError(err.response.data.msg || 'Failed to mark as read.');
      console.error(err.response.data);
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Your Notifications</h3>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul>
          {notifications.map(notification => (
            <li key={notification._id} style={{ backgroundColor: notification.read ? '#f0f0f0' : '#fff', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }}>
              <p>{notification.message}</p>
              <small>Type: {notification.type} | Date: {new Date(notification.createdAt).toLocaleDateString()}</small>
              {!notification.read && (
                <button onClick={() => markAsRead(notification._id)}>Mark as Read</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationList;
