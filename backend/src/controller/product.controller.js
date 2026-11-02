import { ProductService } from "../service/product.service.js";
import { catchAsync } from "../util/catchAsync.js";

const productService = new ProductService();

export class ProductController {

    create = catchAsync(async (req, res) => {
        const body = req.validated.body;
        const product = await productService.createProduct(body);
        res.status(201).json({ success: true, data: product })
    })
    getAll = catchAsync(async (req, res) => {
        const products  = await productService.getAllProduct();
        res.json({ success: true, data: products  })
    })
     getById = catchAsync(async (req, res) => {
    const id = req.validated.params.id;
    const product = await productService.getProductById(id);
    res.json({ success: true, data: product });
  });
    update = catchAsync(async (req, res) => {

        const id = req.validated.params.id;
        const body = req.validated.body;
        const product = await productService.updateProduct(id, body);
        res.json({ success: true, data: product });
    });

    delete = catchAsync(async (req, res) => {
        const id = req.validated.params.id;
        await productService.deleteProduct(id);
        res.json({ success: true, message: "Product deleted successfully" });
    });


}
