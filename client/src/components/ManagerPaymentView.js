import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManagerPaymentView({ selectedSite }) {
  const [payments, setPayments] = useState([]);
  const [wageReports, setWageReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const config = {
        headers: { 'x-auth-token': token },
        params: { siteId: selectedSite }
      };
      const [paymentsRes, wageReportsRes] = await Promise.all([
        axios.get('http://localhost:5000/payments', config),
        axios.get('http://localhost:5000/wage_reports', config)
      ]);
      setPayments(paymentsRes.data);
      setWageReports(wageReportsRes.data);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.msg || 'Failed to fetch data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSite]); // Re-fetch data when selectedSite changes

  if (loading) {
    return <div>Loading payment data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Payment Management (Manager View)</h3>

      <h4>Subcontractor Payments</h4>
      <button onClick={() => window.open('http://localhost:5000/reports/payments/pdf', '_blank')}>Export Payments to PDF</button>
      {payments.length === 0 ? (
        <p>No payments recorded yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Subcontractor</th>
              <th>Contract Type</th>
              <th>Amount</th>
              <th>Payment Date</th>
              <th>Payment Type</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id}>
                <td>{payment.subcontractor ? payment.subcontractor.name : 'N/A'}</td>
                <td>{payment.contract ? payment.contract.contractType : 'N/A'}</td>
                <td>{payment.amount}</td>
                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                <td>{payment.paymentType}</td>
                <td>{payment.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h4>Worker Wage Reports</h4>
      <button onClick={() => window.open('http://localhost:5000/reports/wage_reports/excel', '_blank')}>Export Wage Reports to Excel</button>
      {wageReports.length === 0 ? (
        <p>No wage reports recorded yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Worker</th>
              <th>Subcontractor</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Total Hours</th>
              <th>Overtime Hours</th>
              <th>Total Wage</th>
              <th>Advances</th>
              <th>Net Pay</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {wageReports.map(report => (
              <tr key={report._id}>
                <td>{report.worker ? report.worker.name : 'N/A'}</td>
                <td>{report.subcontractor ? report.subcontractor.name : 'N/A'}</td>
                <td>{new Date(report.dateFrom).toLocaleDateString()}</td>
                <td>{new Date(report.dateTo).toLocaleDateString()}</td>
                <td>{report.totalHours}</td>
                <td>{report.totalOvertimeHours}</td>
                <td>{report.totalWage}</td>
                <td>{report.advances}</td>
                <td>{report.netPay}</td>
                <td>{report.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManagerPaymentView;
