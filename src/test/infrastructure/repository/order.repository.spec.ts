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

    it("should update an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        customer.Adderss = new Address("Street 1", 1, "Zipcode 1", "City 1");
        await customerRepository.create(customer);
        const productRepository = new ProductRepository();
        const productA = new Product("123", "Product 1", 10);
        const productB = new Product("1234", "Product 2", 20);
        await productRepository.create(productA);
        await productRepository.create(productB);
        const ordemItem1 = new OrderItem(
            "1",
            productA.name,
            productA.price,
            productA.id,
            2
        );
        const ordemItem2 = new OrderItem(
            "2",
            productB.name,
            productB.price,
            productB.id,
            5
        );
        const order = new Order("123", "123", [ordemItem1]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);
        const changeOrder = await orderRepository.findById(order.id);
        changeOrder.items.push(ordemItem2);
        await orderRepository.update(changeOrder);
        const sut = await orderRepository.findById(order.id);
        expect(sut.items).toHaveLength(2);
        expect(sut.id).toBe(order.id);
        expect(sut.items[0].id).toBe("1");
        expect(sut.items[1].id).toBe("2");
    });

    it("should find an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        customer.Adderss = new Address("Street 1", 1, "Zipcode 1", "City 1");

        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const ordemItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );
        const order = new Order("123", "123", [ordemItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderResult = await orderRepository.findById(order.id);

        expect(order).toStrictEqual(orderResult);
    });

    it("should throw an error when order not found", async () => {
        const orderRepository = new OrderRepository();
        await expect(orderRepository.findById("123")).rejects.toThrow(
            "Order not found"
        );
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        customer.Adderss = new Address("Street 1", 1, "Zipcode 1", "City 1");
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const ordemItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            1
        );
        const order = new Order("1", "123", [ordemItem]);

        const ordemItem2 = new OrderItem(
            "2",
            product.name,
            product.price,
            product.id,
            1
        );
        const order2 = new Order("2", "123", [ordemItem2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);
        await orderRepository.create(order2);

        const ordersResult = await orderRepository.findAll();
        expect(ordersResult).toStrictEqual([order, order2]);
    });
});
