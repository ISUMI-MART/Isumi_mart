import React from 'react';
import { useNavigate } from "react-router-dom";
import '../layouts/IsumiMartOrders.css';

const OrderHistory = () => {

  const navigate = useNavigate();
  
  const orders = [
    {
      id: 'IM-1048',
      date: '14 Oct 2026',
      items: '6 items',
      total: 'LKR 2,600.00',
      payment: 'Pending',
      status: 'Out for Delivery',
      action: 'Track order →',
      isLink: true
    },
    {
      id: 'IM-1032',
      date: '10 Oct 2026',
      items: '8 items',
      total: 'LKR 3,180.00',
      payment: 'Paid',
      status: 'Delivered',
      action: 'View details →',
      isLink: false
    },
    {
      id: 'IM-1017',
      date: '04 Oct 2026',
      items: '4 items',
      total: 'LKR 1,620.00',
      payment: 'Paid',
      status: 'Delivered',
      action: 'View details →',
      isLink: false
    },
    {
      id: 'IM-1004',
      date: '28 Sep 2026',
      items: '3 items',
      total: 'LKR 1,100.00',
      payment: 'Pending',
      status: 'Cancelled',
      action: 'View details →',
      isLink: false,
      note: 'Cancelled order IM-1004: cancelled by you before preparation. No payment collected.'
    }
  ];

  return (
    <div className="page-container">

      {/* Page Content */}
      <main className="main-content">
        <h1 className="page-title">Your orders</h1>
        <p className="page-subtitle">All your neighborhood grocery runs, in one place.</p>

        {/* Search Bar Area */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search by order number..." className="search-input" />
          </div>
          <select className="filter-dropdown">
            <option>All orders</option>
          </select>
        </div>

        {/* Table Container Card */}
        <div className="orders-card">
          <h2 className="card-title">Current & past orders</h2>
          
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Placed on</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <tr className={order.status === 'Cancelled' ? 'row-cancelled' : ''}>
                    <td className="order-id">{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.items}</td>
                    <td>{order.total}</td>
                    <td>
                      <span className={`badge-payment ${order.payment.toLowerCase()}`}>
                        {order.payment}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button className={`action-btn ${order.isLink ? 'btn-link' : ''}`}>
                        {order.action}
                      </button>
                    </td>
                  </tr>
                  {order.note && (
                    <tr className="note-row">
                      <td colSpan="7" className="cancelled-note">
                        {order.note}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Navigation Controls */}
        <div className="table-footer">
          <span className="results-count">Showing all 4 orders</span>
          <button className="back-btn"onClick={() => navigate("/products")}>Back to shopping</button>
        </div>
      </main>

    
    </div>
  );
};

export default OrderHistory;
