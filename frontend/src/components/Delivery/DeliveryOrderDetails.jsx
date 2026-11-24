import { useState } from "react";

const money = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

function DeliveryOrderDetails({ order, onStatusChange, updating = false }) {
    const [failureReason, setFailureReason] = useState("");
    const [failureNote, setFailureNote] = useState("");
    const [showReasonForm, setShowReasonForm] = useState(false);

    if (!order) {
        return (
            <div className="empty" style={{ padding: "65px 15px" }}>
                <div style={{ fontSize: 35, marginBottom: 12 }}><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moped preview-icon"><path d="m18.16 14.12-2.927-8.447A1 1 0 0 0 14.288 5H13"/><path d="M19 10a7 7 0 0 0-6.928 6"/><path d="M2 10h5.5a3 3 0 0 1 2.747 1.795l1.669 3.803A1 1 0 0 1 11.01 17H8"/><circle cx="19" cy="17" r="3"/><circle cx="5" cy="17" r="3"/></svg></div>
                <b style={{ color: "#405047" }}>Select a delivery</b>
                <p>
                    Choose an order from your queue to view its details
                    and update its status.
                </p>
            </div>
        );
    }

    const isTerminal = [
        "DELIVERED",
        "DELIVERY_FAILED",
        "CANCELLED",
    ].includes(order.status);

    const statusLabels = {
        ASSIGNED: "Assigned",
        PICKED_UP: "Picked up",
        OUT_FOR_DELIVERY: "On the way",
        DELIVERED: "Delivered",
        DELIVERY_FAILED: "Not Delivered",
        CANCELLED: "Cancelled",
    };

    const allowedTransitions = {
        ASSIGNED: ["PICKED_UP", "DELIVERY_FAILED"],
        PICKED_UP: ["OUT_FOR_DELIVERY", "DELIVERY_FAILED"],
        OUT_FOR_DELIVERY: ["DELIVERED", "DELIVERY_FAILED"],
    };

    const availableStatuses = allowedTransitions[order.status] || [];

    const handleStatusChange = (status) => {
        if (status === "DELIVERY_FAILED") {
            setFailureReason("");
            setFailureNote("");
            setShowReasonForm(true);
            return;
        }

        setShowReasonForm(false);
        onStatusChange(order.id, status);
    };

    const submitFailureReason = () => {
        if (!failureReason) {
            alert("Please select a reason.");
            return;
        }

        onStatusChange(order.id, "DELIVERY_FAILED", {
            deliveryFailureReason: failureReason,
            deliveryFailureNote: failureNote.trim(),
        });

        setShowReasonForm(false);
    };

    return (
        <>
            <div className="panelhead">
                <h3>Delivery details</h3>
                <span className="pill blue">{order.id}</span>
            </div>

            <h2 style={{ font: "800 18px Manrope", margin: "8px 0" }}>
                {order.customer}
            </h2>

            <p className="muted">CUSTOMER</p>
            <p style={{ fontSize: 13 }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-call preview-icon"><path d="M13 2a9 9 0 0 1 9 9"/><path d="M13 6a5 5 0 0 1 5 5"/><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>   {order.phone}</p>
            <p style={{ fontSize: 13 }}> {order.address}</p>

            <div
                style={{
                    height: 1,
                    background: "#edf1ed",
                    margin: "17px 0",
                }}
            />

            <h3>Order items</h3>

            {(order.items || []).map((item, index) => (
                <div
                    key={item.id || index}
                    className="row"
                    style={{
                        padding: "10px 0",
                        borderBottom: "1px solid #f0f3f0",
                    }}
                >
                    <span style={{ fontSize: 12 }}>
                        {typeof item === "string"
                            ? item
                            : `${item.name} x ${item.quantity}`}
                    </span>
                </div>
            ))}

            <div className="row" style={{ padding: "14px 0" }}>
                <b>Total to collect</b>
                <b className="strong">{money(order.total)}</b>
            </div>

            <p className="muted">Payment: Cash on Delivery</p>

            {order.note && (
                <p className="muted">Note: {order.note}</p>
            )}

            {order.status === "DELIVERY_FAILED" && (
                <div className="delivery-failure">
                    <strong>Delivery Unsuccessful</strong>
                    <p>
                        Reason: {order.deliveryFailureReason || "Not provided"}
                    </p>

                    {order.deliveryFailureNote && (
                        <p>Details: {order.deliveryFailureNote}</p>
                    )}
                </div>
            )}

            <div className="formgrid" style={{ marginTop: 15 }}>
                <label>
                    Update delivery status

                    <select
                        className="field"
                        value={order.status}
                        disabled={isTerminal || updating}
                        onChange={(e) => handleStatusChange(e.target.value)}
                    >
                        <option value={order.status}>
                            {statusLabels[order.status] || order.status}
                        </option>

                        {availableStatuses.map((status) => (
                            <option key={status} value={status}>
                                {statusLabels[status]}
                            </option>
                        ))}
                    </select>
                </label>

                {showReasonForm && (
                    <div className="delivery-failure-form">
                        <h3>Why couldn't you deliver this order?</h3>

                        <label>
                            Select reason

                            <select
                                className="field"
                                value={failureReason}
                                disabled={updating}
                                onChange={(e) =>
                                    setFailureReason(e.target.value)
                                }
                            >
                                <option value="">Choose a reason</option>
                                <option value="Customer unavailable">
                                    Customer unavailable
                                </option>
                                <option value="Customer phone not reachable">
                                    Customer phone not reachable
                                </option>
                                <option value="Incorrect delivery address">
                                    Incorrect delivery address
                                </option>
                                <option value="Customer cancelled the order">
                                    Customer cancelled the order
                                </option>
                                <option value="Customer refused to accept the order">
                                    Customer refused to accept the order
                                </option>
                                <option value="Other">Other</option>
                            </select>
                        </label>

                        <label>
                            Additional details (optional)

                            <textarea
                                className="field"
                                rows="3"
                                placeholder="Enter additional details..."
                                value={failureNote}
                                disabled={updating}
                                onChange={(e) =>
                                    setFailureNote(e.target.value)
                                }
                            />
                        </label>

                        <div className="confirmation-buttons">
                            <button
                                className="white-button"
                                disabled={updating}
                                onClick={() => setShowReasonForm(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="green-button"
                                disabled={updating}
                                onClick={submitFailureReason}
                            >
                                {updating ? "Saving..." : "Submit reason"}
                            </button>
                        </div>
                    </div>
                )}

                {!isTerminal &&
                    !showReasonForm &&
                    availableStatuses.includes("DELIVERED") && (
                        <button
                            className="btn"
                            disabled={updating}
                            onClick={() => handleStatusChange("DELIVERED")}
                        >
                            {updating ? "Updating..." : "✓ Mark as delivered"}
                        </button>
                    )}
            </div>
        </>
    );
}

export default DeliveryOrderDetails;
