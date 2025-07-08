import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SupervisorIssueView({ selectedSite }) {
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueDescription, setNewIssueDescription] = useState('');
  const [newIssueAssignedTo, setNewIssueAssignedTo] = useState('');
  const [newIssuePriority, setNewIssuePriority] = useState('medium');
  const [reportedBy, setReportedBy] = useState('');

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
      const [issuesRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/issues', config),
        axios.get('http://localhost:5000/users/user', { headers: { 'x-auth-token': token } })
      ]);
      setIssues(issuesRes.data);
      setUsers([usersRes.data]); // Assuming current user is the one who reports
      setReportedBy(usersRes.data._id);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.msg || 'Failed to fetch data.');
      setLoading(false);
    }
  };

  const handleAddIssue = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/issues/add', {
        title: newIssueTitle,
        description: newIssueDescription,
        reportedBy: reportedBy,
        assignedTo: newIssueAssignedTo || null, // Can be null initially
        priority: newIssuePriority,
        site: selectedSite
      }, {
        headers: { 'x-auth-token': token }
      });
      alert('Issue reported successfully!');
      setNewIssueTitle('');
      setNewIssueDescription('');
      setNewIssueAssignedTo('');
      setNewIssuePriority('medium');
      fetchData();
    } catch (err) {
      setError(err.response.data.msg || 'Failed to add issue.');
      console.error(err.response.data);
    }
  };

  const handleUpdateIssueStatus = async (issueId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/issues/update/${issueId}`, {
        status: newStatus
      }, {
        headers: { 'x-auth-token': token }
      });
      alert('Issue status updated!');
      fetchData();
    } catch (err) {
      setError(err.response.data.msg || 'Failed to update issue status.');
      console.error(err.response.data);
    }
  };

  if (loading) {
    return <div>Loading issue data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Report New Issue</h3>
      <form onSubmit={handleAddIssue}>
        <div>
          <label>Title:</label>
          <input type="text" value={newIssueTitle} onChange={(e) => setNewIssueTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={newIssueDescription} onChange={(e) => setNewIssueDescription(e.target.value)} required></textarea>
        </div>
        <div>
          <label>Priority:</label>
          <select value={newIssuePriority} onChange={(e) => setNewIssuePriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        {/* Optionally assign to a user here, or leave for later */}
        <button type="submit">Report Issue</button>
      </form>

      <h3>All Issues</h3>
      {issues.length === 0 ? (
        <p>No issues reported yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Reported By</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Site</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue._id}>
                <td>{issue.title}</td>
                <td>{issue.description}</td>
                <td>{issue.reportedBy ? issue.reportedBy.username : 'N/A'}</td>
                <td>{issue.assignedTo ? issue.assignedTo.username : 'N/A'}</td>
                <td>{issue.status}</td>
                <td>{issue.priority}</td>
                <td>{issue.site ? issue.site.name : 'N/A'}</td>
                <td>
                  {issue.status !== 'resolved' && issue.status !== 'closed' && (
                    <button onClick={() => handleUpdateIssueStatus(issue._id, 'resolved')}>Mark as Resolved</button>
                  )}
                  {issue.status === 'resolved' && (
                    <button onClick={() => handleUpdateIssueStatus(issue._id, 'closed')}>Mark as Closed</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SupervisorIssueView;
