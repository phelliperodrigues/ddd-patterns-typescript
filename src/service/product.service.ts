import Product from "../entity/product";

export default class ProductService {
    static increasePercentualPrice(
        products: Product[],
        percentual: number
    ): void {
        products.forEach((product) => {
            product.changePrice(
                product.price + (product.price * percentual) / 100
            );
        });
    }
}
