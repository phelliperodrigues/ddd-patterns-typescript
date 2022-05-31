import Order from "../entity/order";
import OrderItem from "../entity/order_item";

describe("Order unit tests", () => {
    it("should throw error when ID is empty", () => {
        expect(() => {
            const order = new Order("", "123", []);
        }).toThrowError("Id is required");
    });

    it("should throw error when CustomerId is empty", () => {
        expect(() => {
            const order = new Order("1", "", []);
        }).toThrowError("Customer ID is required");
    });

    it("should throw error when Items is empty", () => {
        expect(() => {
            const order = new Order("1", "123", []);
        }).toThrowError("Items are required");
    });

    it("should calculate total", () => {
        const item = new OrderItem("1", "Item 1", 100);
        const item2 = new OrderItem("1", "Item 1", 100);
        const order = new Order("1", "123", [item, item2]);
        const total = order.total();

        expect(total).toBe(200);
    });
});
