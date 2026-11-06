import { useParams, useNavigate } from "react-router-dom";

function TrackOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Order Details</h1>

      <p>Order ID: {id}</p>

      <button className="light-button" onClick={() => navigate("/order-confirmation")}>
        Back to Orders
      </button>
    </div>
  );
}

export default TrackOrder;