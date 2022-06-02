import Order from "../../app/domain/entity/order";
import OrderRepositoryInterface from "../../app/domain/repository/order-repository.interfase";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customerId: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name,
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            }
        );
    }

    async update(entity: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<Order> {
        throw new Error("Method not implemented.");
    }

    async findAll(): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
}
