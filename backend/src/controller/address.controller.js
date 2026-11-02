import { AddressService } from "../service/address.service.js";
import { catchAsync } from "../util/catchAsync.js";

const addressService = new AddressService();

export class AddressController {
    create = catchAsync(async (req, res) => {
        const data = req.validated.body;
        const userId = req.currentUser.id;

        const address = await addressService.create(userId, data);

        res.status(201).json({
            success: true,
            data: address
        });
    });

    getAll = catchAsync(async (req, res) => {
        const userId = req.currentUser.id;

        const addresses = await addressService.getAll(userId);

        res.status(200).json({
            success: true,
            data: addresses
        });
    });

    getById = catchAsync(async (req, res) => {
        const id = req.validated.params.id;
        const userId = req.currentUser.id;

        const address = await addressService.getById(id, userId);

        res.status(200).json({
            success: true,
            data: address
        });
    });

    update = catchAsync(async (req, res) => {
        const id = req.validated.params.id;
        const userId = req.currentUser.id;
        const data = req.validated.body;

        const address = await addressService.update(id, userId, data);

        res.status(200).json({
            success: true,
            data: address
        });
    });

    delete = catchAsync(async (req, res) => {
        const id = req.validated.params.id;
        const userId = req.currentUser.id;

        await addressService.delete(id, userId);

        res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        });
    });
}