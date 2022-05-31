import Address from "./entity/address";
import Customer from "./entity/customer";
import Order from "./entity/order";
import OrderItem from "./entity/order_item";

// Customer Agregate
const customer = new Customer("123", "Phellipe Rodrigues");
const address = new Address("Rua 1", 2, "12345-000", "Cidade");
customer.Adderss = address;
customer.activate();

// Order Agregate
const item1 = new OrderItem("1", "Item 1", 10, "p1", 2);
const item2 = new OrderItem("1", "Item 2", 15, "p2", 3);
const order = new Order("1", "123", [item1, item2]);
