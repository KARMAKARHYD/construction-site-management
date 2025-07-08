import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TimekeeperAttendanceView() {
  const [workers, setWorkers] = useState([]);
  const [subcontractors, setSubcontractors] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedWorker, setSelectedWorker] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('present');
  const [overtimeHours, setOvertimeHours] = useState(0);

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
      const [workersRes, subcontractorsRes, attendanceRes] = await Promise.all([
        axios.get('http://localhost:5000/workers', { headers: { 'x-auth-token': token } }),
        axios.get('http://localhost:5000/subcontractors', { headers: { 'x-auth-token': token } }),
        axios.get('http://localhost:5000/attendance', { headers: { 'x-auth-token': token } })
      ]);
      setWorkers(workersRes.data);
      setSubcontractors(subcontractorsRes.data);
      setAttendanceRecords(attendanceRes.data);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.msg || 'Failed to fetch data.');
      setLoading(false);
    }
  };

  const handleAddAttendance = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const selectedWorkerObj = workers.find(worker => worker._id === selectedWorker);
    if (!selectedWorkerObj) {
      setError('Please select a worker.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/attendance/add', {
        worker: selectedWorker,
        subcontractor: selectedWorkerObj.subcontractor,
        date: attendanceDate,
        status: attendanceStatus,
        overtimeHours: overtimeHours
      }, {
        headers: { 'x-auth-token': token }
      });
      alert('Attendance recorded successfully!');
      setSelectedWorker('');
      setAttendanceDate('');
      setAttendanceStatus('present');
      setOvertimeHours(0);
      fetchData();
    } catch (err) {
      setError(err.response.data.msg || 'Failed to record attendance.');
      console.error(err.response.data);
    }
  };

  if (loading) {
    return <div>Loading attendance data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Record Daily Attendance</h3>
      <form onSubmit={handleAddAttendance}>
        <div>
          <label>Worker:</label>
          <select value={selectedWorker} onChange={(e) => setSelectedWorker(e.target.value)} required>
            <option value="">Select Worker</option>
            {workers.map(worker => (
              <option key={worker._id} value={worker._id}>{worker.name} ({subcontractors.find(sub => sub._id === worker.subcontractor)?.name})</option>
            ))}
          </select>
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} required />
        </div>
        <div>
          <label>Status:</label>
          <select value={attendanceStatus} onChange={(e) => setAttendanceStatus(e.target.value)}>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
          </select>
        </div>
        {attendanceStatus === 'present' && (
          <div>
            <label>Overtime Hours:</label>
            <input type="number" value={overtimeHours} onChange={(e) => setOvertimeHours(Number(e.target.value))} min="0" />
          </div>
        )}
        <button type="submit">Record Attendance</button>
      </form>

      <h4>Attendance Records</h4>
      {attendanceRecords.length === 0 ? (
        <p>No attendance records yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Worker</th>
              <th>Subcontractor</th>
              <th>Date</th>
              <th>Status</th>
              <th>Overtime</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map(record => (
              <tr key={record._id}>
                <td>{record.worker ? record.worker.name : 'N/A'}</td>
                <td>{record.subcontractor ? record.subcontractor.name : 'N/A'}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.status}</td>
                <td>{record.overtimeHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TimekeeperAttendanceView;
