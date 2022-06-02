import { Sequelize } from "sequelize-typescript";
import Product from "../../../app/domain/entity/product";
import ProductModel from "../../../infrastructure/db/sequelize/model/product.model";
import ProductRepository from "../../../infrastructure/repository/product.repository";

describe("Product repository test", () => {
    let sequileze: Sequelize;

    beforeEach(async () => {
        sequileze = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequileze.addModels([ProductModel]);

        await sequileze.sync();
    });

    afterEach(async () => {
        await sequileze.close();
    });

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 10);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: "1" } });

        expect(productModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 1",
            price: 10,
        });
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 10);

        await productRepository.create(product);

        product.changeName("Product 2");
        product.changePrice(20);

        await productRepository.update(product);

        const productModel = await ProductModel.findOne({ where: { id: "1" } });

        expect(productModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 2",
            price: 20,
        });
    });

    it("should find a product by id", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 10);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: "1" } });

        const foundProduct = await productRepository.findById("1");

        expect(productModel.toJSON()).toStrictEqual({
            id: foundProduct.id,
            name: foundProduct.name,
            price: foundProduct.price,
        });
    });

    it("should find all products", async () => {
        const productRepository = new ProductRepository();
        const product1 = new Product("1", "Product 1", 10);
        const product2 = new Product("2", "Product 2", 20);
        const products = [product1, product2];

        await productRepository.create(product1);
        await productRepository.create(product2);

        const productModels = await ProductModel.findAll();

        const foundProducts = await productRepository.findAll();

        expect(products).toEqual(foundProducts);
    });
});
