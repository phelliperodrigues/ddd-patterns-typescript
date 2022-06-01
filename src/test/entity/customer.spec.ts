import Address from "../../app/domain/entity/address";
import Customer from "../../app/domain/entity/customer";

describe("Customer unit tests", () => {
    it("should throw error when ID is empty", () => {
        expect(() => {
            const customer = new Customer("", "Jhon");
        }).toThrowError("Id is required");
    });

    it("should throw error when NAME is empty", () => {
        expect(() => {
            const customer = new Customer("123", "");
        }).toThrowError("Name is required");
    });

    it("should change name", () => {
        const customer = new Customer("123", "Jhon");
        customer.changeName("Paul");
        expect(customer.name).toBe("Paul");
    });

    it("should activate customer", () => {
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Rua 1", 1, "11111-11", "City 1");
        customer.Adderss = address;

        customer.activate();

        expect(customer.isActive()).toBe(true);
    });

    it("should deactivate customer", () => {
        const customer = new Customer("123", "Customer 1");
        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    });

    it("should throw error when activate customer without address", () => {
        expect(() => {
            const customer = new Customer("123", "Customer 1");

            customer.activate();
        }).toThrowError("Address is mandatory to activate  a customer");
    });

    it("should add reward points", () => {
        const customer = new Customer("123", "Customer 1");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);

        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });
});
