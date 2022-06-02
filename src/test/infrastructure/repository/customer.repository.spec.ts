import { Sequelize } from "sequelize-typescript";
import Address from "../../../app/domain/entity/address";
import Customer from "../../../app/domain/entity/customer";
import CustomerModel from "../../../infrastructure/db/sequelize/model/customer.model";
import CustomerRepository from "../../../infrastructure/repository/customer.repository";

describe("Customer repository test", () => {
    let sequileze: Sequelize;

    beforeEach(async () => {
        sequileze = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequileze.addModels([CustomerModel]);

        await sequileze.sync();
    });

    afterEach(async () => {
        await sequileze.close();
    });

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "John Doe");
        customer.Adderss = new Address("Street 1", 1, "Zipcode 1", "City 1");

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({
            where: { id: "1" },
        });

        expect(customerModel.toJSON()).toEqual({
            id: "1",
            name: customer.name,
            street: customer.address.street,
            number: customer.address.number,
            zip: customer.address.zip,
            city: customer.address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        });
    });

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "John Doe");
        customer.Adderss = new Address("Street 1", 1, "Zipcode 1", "City 1");
        const addreess2 = new Address("Street 2", 2, "Zipcode 2", "City 2");

        await customerRepository.create(customer);

        customer.changeName("Jane Doe 2");
        customer.Adderss = addreess2;

        await customerRepository.update(customer);

        const customerModel = await CustomerModel.findOne({
            where: { id: "1" },
        });

        expect(customerModel.toJSON()).toEqual({
            id: "1",
            name: customer.name,
            street: customer.address.street,
            number: customer.address.number,
            zip: customer.address.zip,
            city: customer.address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        });
    });

    it("should find a customer by id", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "John Doe");
        customer.Adderss = new Address("Street 1", 1, "Zipcode 1", "City 1");

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({
            where: { id: "1" },
        });

        expect(customerModel.toJSON()).toEqual({
            id: "1",
            name: customer.name,
            street: customer.address.street,
            number: customer.address.number,
            zip: customer.address.zip,
            city: customer.address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        });
    });

    it("should throw an error when customer is not found", async () => {
        const customerRepository = new CustomerRepository();

        expect(async () => {
            await customerRepository.findById("1");
        }).rejects.toThrowError("Customer not found");
    });

    it("should find all customers", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "John Doe");
        customer.Adderss = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.addRewardPoints(10);
        const customer2 = new Customer("2", "Jane Doe");
        customer2.Adderss = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer2.addRewardPoints(20);

        await customerRepository.create(customer);
        await customerRepository.create(customer2);

        const customerModels = await CustomerModel.findAll();

        const customers = await customerRepository.findAll();

        expect(customers).toHaveLength(2);
        expect(customers).toContainEqual(customer);
        expect(customers).toContainEqual(customer2);
    });
});
