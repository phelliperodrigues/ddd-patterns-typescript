import OrderItem from "../entity/order_item";

describe("OrderItem unit tests", () => {
    it("should throw error when ID is empty", () => {
        expect(() => {
            const orderItem = new OrderItem("", "Item 1", 100, "1", 1);
        }).toThrowError("Id is required");
    });

    it("should throw error when Name is empty", () => {
        expect(() => {
            const orderItem = new OrderItem("1", "", 100, "1", 1);
        }).toThrowError("Name is required");
    });

    it("should throw error when price is less than zero", () => {
        expect(() => {
            const orderItem = new OrderItem("1", "Item 1", 0, "1", 1);
        }).toThrowError("Price must be greater than zero");
    });

    it("should throw error when quantity is less than zero", () => {
        expect(() => {
            const orderItem = new OrderItem("1", "Item 1", 100, "1", 0);
        }).toThrowError("Quantity must be greater than zero");
    });

    it("should throw error when productId is empty", () => {
        expect(() => {
            const orderItem = new OrderItem("1", "Item 1", 100, "", 1);
        }).toThrowError("Product ID is required");
    });
});
