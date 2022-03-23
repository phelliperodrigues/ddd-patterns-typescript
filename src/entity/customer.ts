class Customer {
    _id: string;
    _name: string;
    _address: string;

    constructor(id: string, name: string, address: string){
        this._id = id;
        this._address = address;
        this._name = name;
    }
    
    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get address(): string {
        return this._address;
    }
    
    set address(address: string) {
        this._address =address;
    }

    set id(id: string) {
        this._id =id;
    }

    set name(name: string) {
        this._name =name;
    }
    
}