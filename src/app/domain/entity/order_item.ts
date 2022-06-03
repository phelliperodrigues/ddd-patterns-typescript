export default class OrderItem {
    private _id: string;
    private _name: string;
    private _price: number;
    private _productId: string;
    private _quantity: number;

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get productId(): string {
        return this._productId;
    }

    get price(): number {
        return this._price;
    }

    constructor(
        id: string,
        name: string,
        price: number,
        productId: string,
        quantity: number
    ) {
        this._id = id;
        this._name = name;
        this._price = price;
        this._productId = productId;
        this._quantity = quantity;
        this.validate();
    }

    validate(): void {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }
        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
        if (this._price <= 0) {
            throw new Error("Price must be greater than zero");
        }
        if (this._quantity <= 0) {
            throw new Error("Quantity must be greater than zero");
        }
        if (this._productId.length === 0) {
            throw new Error("Product ID is required");
        }
    }

    total_item(): number {
        return this._price * this._quantity;
    }

    get quantity(): number {
        return this._quantity;
    }
}
