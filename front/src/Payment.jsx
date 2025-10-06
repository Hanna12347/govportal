import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./paymentpage.css";

const PaymentPage = () => {
  const { state } = useLocation();
  const { requestId: passedId, service } = state || {};

  const [formData, setFormData] = useState({
    requestId: passedId || "",
    amount: "",
    method: ""
  });

  const [isPaid, setIsPaid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      const data = await res.json();

      if (res.ok) {
        setIsPaid(true);
      } else {
        alert(data.error || 'Payment failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error processing payment');
    }
  };

  if (isPaid) {
    return (
      <div className="success-message">
        <h2> Payment Successful</h2>
        <p>Your payment for <strong>{service}</strong> was recorded successfully.</p>
        <Link to="/">home</Link>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Government Service Payment</h2>
      <form onSubmit={handleSubmit} className="simple-form">
        <div className="form-group">
          <label htmlFor="requestId">Request ID:</label>
          <input
            type="number"
            id="requestId"
            name="requestId"
            value={formData.requestId}
            onChange={handleChange}
            readOnly={!!passedId} 
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount ($):</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter payment amount"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="method">Payment Method:</label>
          <select
            id="method"
            name="method"
            value={formData.method}
            onChange={handleChange}
            required
          >
            <option value="">Select method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="PayPal">PayPal</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Submit Payment</button>
      </form>
    </div>
  );
};

export default PaymentPage;
