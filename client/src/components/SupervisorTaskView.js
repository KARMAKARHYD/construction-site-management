import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SupervisorTaskView() {
  const [tasks, setTasks] = useState([]);
  const [subcontractors, setSubcontractors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskAssignedBy, setNewTaskAssignedBy] = useState('');

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
      const [tasksRes, subcontractorsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/tasks', { headers: { 'x-auth-token': token } }),
        axios.get('http://localhost:5000/subcontractors', { headers: { 'x-auth-token': token } }),
        axios.get('http://localhost:5000/users/user', { headers: { 'x-auth-token': token } })
      ]);
      setTasks(tasksRes.data);
      setSubcontractors(subcontractorsRes.data);
      setUsers([usersRes.data]); // Assuming assignedBy is the current user
      setNewTaskAssignedBy(usersRes.data._id);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.msg || 'Failed to fetch data.');
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/tasks/add', {
        title: newTaskTitle,
        description: newTaskDescription,
        assignedTo: newTaskAssignedTo,
        assignedBy: newTaskAssignedBy,
        dueDate: newTaskDueDate,
      }, {
        headers: { 'x-auth-token': token }
      });
      alert('Task added successfully!');
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskAssignedTo('');
      setNewTaskDueDate('');
      fetchData();
    } catch (err) {
      setError(err.response.data.msg || 'Failed to add task.');
      console.error(err.response.data);
    }
  };

  const handleVerifyUpdate = async (taskId, progressUpdateId) => {
    const token = localStorage.getItem('token');
    try {
      // This is a placeholder. In a real app, you'd have a specific API endpoint
      // to mark a progress update as verified, possibly by a supervisor.
      // For now, we'll just log it.
      alert(`Progress update ${progressUpdateId} for task ${taskId} verified!`);
      // You might want to update the task status or add a verification flag in the DB
    } catch (err) {
      setError(err.response.data.msg || 'Failed to verify update.');
      console.error(err.response.data);
    }
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Assign New Task</h3>
      <form onSubmit={handleAddTask}>
        <div>
          <label>Title:</label>
          <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} required></textarea>
        </div>
        <div>
          <label>Assign To Subcontractor:</label>
          <select value={newTaskAssignedTo} onChange={(e) => setNewTaskAssignedTo(e.target.value)} required>
            <option value="">Select Subcontractor</option>
            {subcontractors.map(sub => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Due Date:</label>
          <input type="date" value={newTaskDueDate} onChange={(e) => setNewTaskDueDate(e.target.value)} required />
        </div>
        <button type="submit">Add Task</button>
      </form>

      <h3>All Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task._id}>
              <h4>{task.title} (Assigned to: {task.assignedTo ? task.assignedTo.name : 'N/A'})</h4>
              <p>Description: {task.description}</p>
              <p>Assigned By: {task.assignedBy ? task.assignedBy.username : 'N/A'}</p>
              <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p>Status: {task.status}</p>
              {task.progressUpdates && task.progressUpdates.length > 0 && (
                <div>
                  <h6>Progress History:</h6>
                  <ul>
                    {task.progressUpdates.map((update, index) => (
                      <li key={index}>
                        <p>Date: {new Date(update.date).toLocaleDateString()}</p>
                        <p>Description: {update.description}</p>
                        {update.photos && update.photos.length > 0 && (
                          <div>
                            <h6>Photos:</h6>
                            {update.photos.map((photo, photoIndex) => (
                              <img key={photoIndex} src={`http://localhost:5000${photo}`} alt="Progress" style={{ width: '100px', height: '100px', margin: '5px' }} />
                            ))}
                          </div>
                        )}
                        <button onClick={() => handleVerifyUpdate(task._id, update._id)}>Verify Update</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SupervisorTaskView;
