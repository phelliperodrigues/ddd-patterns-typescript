import { Sequelize } from "sequelize-typescript";
import OrderModel from "../../../infrastructure/db/sequelize/model/order.model";

describe("Order repository test", () => {
    let sequileze: Sequelize;

    beforeEach(async () => {
        sequileze = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequileze.addModels([OrderModel]);

        await sequileze.sync();
    });

    afterEach(async () => {
        await sequileze.close();
    });
});
