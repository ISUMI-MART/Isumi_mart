import { NotFoundError } from "../errors/appError.js";
import { OrderRepository } from "../repository/order.repository.js";

const orderRepository = new OrderRepository();

function createOrderError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export class OrderService {

  async create(userId, data) {
    return await orderRepository.createOrder({
      ...data,
      userId,
    });
  }

  async getAll(userId, role) {
    return await orderRepository.getAll(userId, role);
  }

  async getById(id, userId, role) {
    const order = await orderRepository.getById(id);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Customers can view only their own orders
    if (role === "CUSTOMER" && order.userId !== userId) {
      throw new Error("You are not allowed to view this order");
    }

    // Delivery agents can view only orders assigned to them
    if (role === "DELIVERY_AGENT" && order.deliveryAgentId !== userId) {
      throw new Error("You are not allowed to view this order");
    }

    return order;
  }

  async updateStatus(id, status, userId, role, extraData = {}) {
    const order = await orderRepository.getById(id);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (role === "CUSTOMER") {
      // Customers can cancel only their own orders
      if (order.userId !== userId) {
        throw createOrderError(
          "You are not allowed to update this order.",
          403,
        );
      }

      // Customers can only cancel orders
      if (status !== "CANCELLED") {
        throw createOrderError("Customers can only cancel orders.", 403);
      }

      // Customers can cancel only before delivery starts
      if (!["ORDER_PLACED", "ASSIGNED"].includes(order.status)) {
        throw createOrderError("This order can no longer be cancelled.", 400);
      }
    }

    // OWNER permissions
    else if (role === "OWNER") {
      const ownerAllowedStatuses = ["CONFIRMED", "PREPARING", "ASSIGNED"];

      if (!ownerAllowedStatuses.includes(status)) {
        throw createOrderError("Owner cannot update this order status.", 403);
      }
    }

    // DELIVERY AGENT permissions
    else if (role === "DELIVERY_AGENT") {
      if (order.deliveryAgentId !== userId) {
        throw createOrderError("This order is not assigned to you.", 403);
      }

      if (
        ["DELIVERED", "DELIVERY_FAILED", "CANCELLED"].includes(order.status)
      ) {
        throw createOrderError("This order can no longer be updated.");
      }

      const allowedTransitions = {
        ASSIGNED: ["PICKED_UP", "DELIVERY_FAILED"],
        PICKED_UP: ["OUT_FOR_DELIVERY", "DELIVERY_FAILED"],
        OUT_FOR_DELIVERY: ["DELIVERED", "DELIVERY_FAILED"],
      };

      const allowedStatuses = allowedTransitions[order.status] || [];

      if (!allowedStatuses.includes(status)) {
        throw createOrderError("Invalid delivery status change.");
      }
    } else {
      throw createOrderError("You are not allowed to update this order.", 403);
    }

    // Save status and any delivery failure details
    return await orderRepository.updateStatus(id, status, extraData);
  }
  async assignAgent(orderId, deliveryAgentId) {
    return await orderRepository.assignAgent(orderId, deliveryAgentId);
  }
}
