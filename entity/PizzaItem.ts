module app.entity{
    export interface IPizzaItem{
        id:string;
        name:string;
        description:string;
        toppings:IToppingItem[];
    }

    export class PizzaItem implements IPizzaItem{
        id:string;
        name:string;
        description:string;
        toppings:IToppingItem[];
    }
}
