import { NotFoundError } from "../errors/appError.js";
import { AddressRepository } from "../repository/address.repository.js";

const addressRepository = new AddressRepository();

export class AddressService {
    async create(userId, data) {
        if (data.isDefault) {
        }

        return await addressRepository.create({
            ...data,
            userId
        });
    }

    async getAll(userId) {
        return await addressRepository.findAllByUserId(userId);
    }

    async getById(id, userId) {
        const address = await addressRepository.findById(id);

        if (!address || address.userId !== userId) {
            throw new NotFoundError("Address not found");
        }

        return address;
    }

    async update(id, userId, data) {
        const address = await addressRepository.findById(id);
        if (!address || address.userId !== userId) {
            throw new NotFoundError("Address not found");
        }
        return await addressRepository.update(id, data);
    }

    async delete(id, userId) {
        const address = await addressRepository.findById(id);

        if (!address || address.userId !== userId) {
            throw new NotFoundError("Address not found");
        }

        return await addressRepository.delete(id);
    }
}