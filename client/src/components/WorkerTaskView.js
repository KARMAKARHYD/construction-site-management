import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WorkerTaskView() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [progressDescription, setProgressDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in.');
      setLoading(false);
      return;
    }

    try {
      // In a real application, you would filter tasks by the logged-in worker's ID
      // For now, we fetch all and filter on the client side for simplicity
      const res = await axios.get('http://localhost:5000/tasks', {
        headers: {
          'x-auth-token': token
        }
      });
      // Assuming the backend returns tasks with assignedTo populated with user ID
      // For now, we'll just display all tasks for demonstration
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.msg || 'Failed to fetch tasks.');
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleProgressUpdate = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      let filePaths = [];
      if (selectedFiles.length > 0) {
        const uploadRes = await axios.post('http://localhost:5000/uploads/multiple', formData, {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data'
          }
        });
        filePaths = uploadRes.data.filePaths;
      }

      const updatedProgress = {
        description: progressDescription,
        photos: filePaths
      };

      await axios.post(`http://localhost:5000/tasks/update/${selectedTask._id}`, {
        ...selectedTask,
        progressUpdates: [...selectedTask.progressUpdates, updatedProgress]
      }, {
        headers: {
          'x-auth-token': token
        }
      });

      alert('Progress updated successfully!');
      setProgressDescription('');
      setSelectedFiles([]);
      setSelectedTask(null); // Close the update form
      fetchTasks(); // Refresh tasks
    } catch (err) {
      setError(err.response.data.msg || 'Failed to update progress.');
      console.error(err.response.data);
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Your Assigned Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks assigned to you.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task._id}>
              <h4>{task.title}</h4>
              <p>Description: {task.description}</p>
              <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p>Status: {task.status}</p>
              <button onClick={() => setSelectedTask(task)}>Update Progress</button>
              {selectedTask && selectedTask._id === task._id && (
                <form onSubmit={handleProgressUpdate}>
                  <h5>Add Progress Update</h5>
                  <div>
                    <label>Description:</label>
                    <textarea
                      value={progressDescription}
                      onChange={(e) => setProgressDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label>Photos:</label>
                    <input type="file" multiple onChange={handleFileChange} />
                  </div>
                  <button type="submit">Submit Update</button>
                  <button type="button" onClick={() => setSelectedTask(null)}>Cancel</button>
                </form>
              )}
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

export default WorkerTaskView;
