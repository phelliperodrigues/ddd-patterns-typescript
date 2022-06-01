import Order from "../../entity/order";
import OrderItem from "../../entity/order_item";
import OrderService from "../../service/order.service";

describe("Order Service", () => {
    it("shoult get total of all orders", () => {
        const item1 = new OrderItem("1", "Product 1", 10, "p1", 1);
        const item2 = new OrderItem("2", "Product 2", 20, "p2", 2);

        const order = new Order("1", "Customer 1", [item1]);
        const order2 = new Order("2", "Customer 2", [item2]);

        const total = OrderService.total([order, order2]);
        expect(total).toBe(50);
    });
});
