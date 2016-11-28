import { Injectable, EventEmitter,  Input, Output, } from '@angular/core';
import { Headers, Http, Response } from "@angular/http";
import 'rxjs/Rx';
import { Stock } from "./stock";
import {Observable} from 'rxjs/Rx';
/*import { Holding } from "./holding";*/
import 'rxjs/add/operator/map';


@Injectable()
export class StockService {

  stockChanged = new EventEmitter<Stock>();

/*  holding: Holding;*/

/*  cash: number;*/

  stock: Stock;
/*  keys: any;
  stockSymbol: string;*/

  constructor(private http: Http) { }

  symbolLookup(symbol: string){
    console.log(symbol);
    console.log('I did a symbol lookup');

      return this.http.get('http://data.benzinga.com/rest/richquoteDelayed?symbols=' + symbol)
      .map((response: Response) => response.json()[ symbol ])
      .subscribe(
          (data: any) => {
            this.stock = data;
            console.log(this.stock);
            if (this.stock === undefined || symbol === 'null') {
              document.getElementById("error-message").innerHTML = 'Unknown symbol';
            } else {
              this.stockChanged.emit(this.stock);
            }
          }
      );

  }

  viewLookup(symbol: string){
    console.log(symbol);
    console.log('I did a view lookup');

    return this.http.get('http://data.benzinga.com/rest/richquoteDelayed?symbols=' + symbol)
    .map((response: Response) => response.json()[symbol])
    .subscribe(
        (data: any) => {
          this.stock = data;
          console.log(this.stock);

          this.stockChanged.emit(this.stock);
        }
    );

  }

  buyStock(stockName, stockQuantity: number, ASK: number){
      console.log('I bought ' + stockQuantity + ' ' + stockName + ' stock for ' + (stockQuantity * ASK));

/*    this.holding = new Holding(
      stock = new Stock({
        symbol: 'GE',
        name: stockName,
        bidPrice: 0,
        askPrice: 0
      }),
      quantity: stockQuantity,
      value: parseFloat(stockQuantity * ASK)
    );

    console.log(this.holding);*/

  }

  sellStock(stockName, stockQuantity: number, BID: number){
    console.log('I sold ' + stockQuantity + ' ' + stockName +  ' stock for ' + (stockQuantity * BID));
  }

}

