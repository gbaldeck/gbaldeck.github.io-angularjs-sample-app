module app.entity{
    export interface IToppingItem{
        id:string;
        name:string;
    }

    export class ToppingItem implements IToppingItem{
        id:string;
        name:string;
    }
}