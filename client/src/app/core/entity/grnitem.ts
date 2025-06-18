import {Item} from "./item";

export class GrnItem{

  id:number;
  item:Item;
  quantity:number;
  unitprice:number;
  linetotal:number;


  constructor(id: number, item: Item, quantity: number, unitprice: number, linetotal: number) {
    this.id = id;
    this.item = item;
    this.quantity = quantity;
    this.unitprice = unitprice;
    this.linetotal = linetotal;
  }
}


