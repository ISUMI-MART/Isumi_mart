import { NotFoundError } from "../errors/appError.js";
import { OrderItemRepository } from "../repository/orderItem.repository.js";

const orderItemRepository = new OrderItemRepository();

export class OrderItemService {
    // Add a new item to an order
    async create(data) {
        return await orderItemRepository.createItem(data);
    }

    // Update an existing order item
    async update(id, data) {
        const item = await orderItemRepository.getItemById(id);

        if (!item) {
            throw new NotFoundError("Order Item not found");
        }

        return await orderItemRepository.updateItem(id, data);
    }

    // Delete an order item
    async delete(id) {
        const item = await orderItemRepository.getItemById(id);

        if (!item) {
            throw new NotFoundError("Order Item not found");
        }

        return await orderItemRepository.deleteItem(id);
    }
}