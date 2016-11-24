import { Stock } from "./stock";

export class Holding {

  constructor(public stock: Stock,
              public quantity: number,
              public value: number ) {

  }

}
