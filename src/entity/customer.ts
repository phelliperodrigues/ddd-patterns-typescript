class Customer {

    _id: string;
    _name: string;
    _address: string;
    _active: boolean = true;

    constructor(id: string, name: string, address: string){
        this._id = id;
        this._address = address;
        this._name = name;
    }

    changeName(name: string) {
        this._name = name;
    }
    
    activate() {
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }
    
}