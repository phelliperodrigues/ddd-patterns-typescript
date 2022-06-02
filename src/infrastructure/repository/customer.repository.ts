import Address from "../../app/domain/entity/address";
import Customer from "../../app/domain/entity/customer";
import CustomerRepositoryInterface from "../../app/domain/repository/customer-repository.interfase";
import CustomerModel from "../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zip: entity.address.zip,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
        });
    }
    async update(entity: Customer): Promise<void> {
        await CustomerModel.update(
            {
                name: entity.name,
                street: entity.address.street,
                number: entity.address.number,
                zip: entity.address.zip,
                city: entity.address.city,
                active: entity.isActive(),
                rewardPoints: entity.rewardPoints,
            },
            {
                where: {
                    id: entity.id,
                },
            }
        );
    }
    async findById(id: string): Promise<Customer> {
        let customerModel;
        try {
            customerModel = await CustomerModel.findOne({
                where: { id },
                rejectOnEmpty: true,
            });
        } catch (error) {
            throw new Error("Customer not found");
        }
        const customer = new Customer(customerModel.id, customerModel.name);
        customer.Adderss = new Address(
            customerModel.street,
            customerModel.number,
            customerModel.zip,
            customerModel.city
        );
        return customer;
    }

    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();
        return customerModels.map((customerModel) => {
            const customer = new Customer(customerModel.id, customerModel.name);
            customer.addRewardPoints(customerModel.rewardPoints);
            customer.Adderss = new Address(
                customerModel.street,
                customerModel.number,
                customerModel.zip,
                customerModel.city
            );
            if (customerModel.active) {
                customer.activate();
            }
            return customer;
        });
    }
}
