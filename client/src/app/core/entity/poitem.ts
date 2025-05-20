import {Item} from "./item";

export class POItem{

  id:number;
  item:Item;
  quantity:number;
  expectedlinetotal:number;

  constructor(id: number, item: Item, quantity: number, expectedlinetotal: number) {
    this.id = id;
    this.item = item;
    this.quantity = quantity;
    this.expectedlinetotal = expectedlinetotal;
  }

}

