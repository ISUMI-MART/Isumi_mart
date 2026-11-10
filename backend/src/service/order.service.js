import { NotFoundError } from "../errors/appError.js";
import { OrderRepository } from "../repository/order.repository.js";

const orderRepository = new OrderRepository();

export class OrderService {
    // Create a new order
    async create(userId, data) {
        return await orderRepository.createOrder({
            ...data,
            userId
        });
    }

    // Get all orders
    async getAll() {
        return await orderRepository.getAll();
    }

    // Get a specific order by ID
    async getById(id) {
        const order = await orderRepository.getById(id);

        if (!order) {
            throw new NotFoundError("Order not found");
        }

        return order;
    }

    // Update the status of an existing order
    async updateStatus(id, status) {
        const order = await orderRepository.getById(id);

        if (!order) {
            throw new NotFoundError("Order not found");
        }

        return await orderRepository.updateStatus(id, status);
    }
}