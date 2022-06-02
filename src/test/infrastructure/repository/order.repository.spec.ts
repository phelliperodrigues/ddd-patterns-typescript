import { Sequelize } from "sequelize-typescript";
import Address from "../../../app/domain/entity/address";
import Customer from "../../../app/domain/entity/customer";
import Order from "../../../app/domain/entity/order";
import OrderItem from "../../../app/domain/entity/order_item";
import Product from "../../../app/domain/entity/product";
import CustomerModel from "../../../infrastructure/db/sequelize/model/customer.model";
import OrderItemModel from "../../../infrastructure/db/sequelize/model/order-item.model";
import OrderModel from "../../../infrastructure/db/sequelize/model/order.model";
import ProductModel from "../../../infrastructure/db/sequelize/model/product.model";
import CustomerRepository from "../../../infrastructure/repository/customer.repository";
import OrderRepository from "../../../infrastructure/repository/order.repository";
import ProductRepository from "../../../infrastructure/repository/product.repository";

describe("Order repository test", () => {
    let sequileze: Sequelize;

    beforeEach(async () => {
        sequileze = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequileze.addModels([
            OrderModel,
            CustomerModel,
            OrderItemModel,
            ProductModel,
        ]);

        await sequileze.sync();
    });

    afterEach(async () => {
        await sequileze.close();
    });

    it("should create order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "John Doe");
        customer.Adderss = new Address("street", 1, "zip", "city");
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "product", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("1", customer.id, [orderItem]);
        const orderRepository = new OrderRepository();

        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "1",
            customerId: "1",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    orderId: "1",
                    productId: "1",
                },
            ],
        });
    });
});
