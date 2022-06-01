import Customer from "../../../../app/domain/entity/customer";
import Order from "../../../../app/domain/entity/order";
import OrderItem from "../../../../app/domain/entity/order_item";
import OrderService from "../../../../app/domain/service/order.service";

describe("Order Service", () => {
    it("shoult get total of all orders", () => {
        const item1 = new OrderItem("1", "Product 1", 10, "p1", 1);
        const item2 = new OrderItem("2", "Product 2", 20, "p2", 2);

        const order = new Order("1", "Customer 1", [item1]);
        const order2 = new Order("2", "Customer 2", [item2]);

        const total = OrderService.total([order, order2]);
        expect(total).toBe(50);
    });

    it("should place an order", () => {
        const customer = new Customer("1", "Customer 1");
        const item1 = new OrderItem("1", "Product 1", 10, "p1", 1);
        const order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);
    });

    it("should throw an error when placing an order with no items", () => {
        const customer = new Customer("1", "Customer 1");
        expect(() => {
            OrderService.placeOrder(customer, []);
        }).toThrowError("Order must have at least one item");
    });
});
