const money = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

function DeliveryStats({ orders }) {
    const active = orders.filter(
        (order) =>
            ![
                "DELIVERED",
                "DELIVERY_FAILED",
                "CANCELLED",
            ].includes(order.status)
    ).length;

    const completed = orders.filter(
        (order) => order.status === "DELIVERED"
    ).length;

    const inProgress = orders.filter(
        (order) =>
            order.status === "PICKED_UP" ||
            order.status === "OUT_FOR_DELIVERY"
    ).length;

    const cashToCollect = orders
        .filter(
            (order) =>
                ![
                    "DELIVERED",
                    "DELIVERY_FAILED",
                    "CANCELLED",
                ].includes(order.status)
        )
        .reduce(
            (total, order) => total + Number(order.total || 0),
            0
        );

    const stats = [
        ["Assigned deliveries", active, <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-chart-gantt preview-icon"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 8h7"/><path d="M8 12h6"/><path d="M11 16h5"/></svg>, "Ready to complete"],
        ["Completed", completed, <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check preview-icon"><path d="M20 6 9 17l-5-5"/></svg>, "Successfully delivered"],
        ["In progress", inProgress, <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock preview-icon"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, "Currently on route"],
        ["Cash to collect", money(cashToCollect), "₨", "Pending COD total"],
    ];

    return (
        <div className="stats">
            {stats.map(([label, value, icon, description]) => (
                <div className="stat" key={label}>
                    <div className="stat-top">
                        <span>{label}</span>
                        <span className="stat-icon">{icon}</span>
                    </div>

                    <strong>{value}</strong>
                    <small>{description}</small>
                </div>
            ))}
        </div>
    );
}

export default DeliveryStats;
