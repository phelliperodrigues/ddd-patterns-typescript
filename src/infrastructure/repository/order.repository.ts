import Order from "../../app/domain/entity/order";
import OrderItem from "../../app/domain/entity/order_item";
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
        await OrderModel.sequelize.transaction(async (t) => {
            await OrderItemModel.destroy({
                where: { order_id: entity.id },
                transaction: t,
            });
            const items = entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id,
            }));
            await OrderItemModel.bulkCreate(items, { transaction: t });
            await OrderModel.update(
                {
                    total: entity.total(),
                },
                {
                    where: { id: entity.id },
                    transaction: t,
                }
            );
        });
    }

    async findById(id: string): Promise<Order> {
        let orderModel;
        try {
            orderModel = await OrderModel.findOne({
                where: {
                    id,
                },
                include: ["items"],
                rejectOnEmpty: true,
            });
        } catch (error) {
            throw new Error("Order not found");
        }

        const items = orderModel.items.map((item) => {
            const orderItem = new OrderItem(
                item.id,
                item.name,
                item.price,
                item.productId,
                item.quantity
            );
            return orderItem;
        });

        const order = new Order(orderModel.id, orderModel.customerId, items);
        return order;
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({ include: ["items"] });

        const orders = orderModels.map((orderModel) => {
            const items = orderModel.items.map((item) => {
                const orderItem = new OrderItem(
                    item.id,
                    item.name,
                    item.price,
                    item.productId,
                    item.quantity
                );
                return orderItem;
            });

            const order = new Order(
                orderModel.id,
                orderModel.customerId,
                items
            );
            return order;
        });

        return orders;
    }
}
