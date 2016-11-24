import { Injectable, EventEmitter,  Input, Output, } from '@angular/core';
import { Headers, Http, Response } from "@angular/http";
import 'rxjs/Rx';
import { Stock } from "./stock";
import {Observable} from 'rxjs/Rx';
/*import { Holding } from "./holding";*/

@Injectable()
export class StockService {

  stockChanged = new EventEmitter<any>();

/*  holding: Holding;*/

/*  cash: number;*/

  stock: Stock;
/*  keys: any;
  stockSymbol: string;*/

  constructor(private http: Http) { }

  symbolLookup(symbol){
    console.log(symbol);
    console.log('I did a symbol lookup');

      return this.http.get('http://data.benzinga.com/rest/richquoteDelayed?symbols=' + symbol)
      .map((response: Response) => response.json())
      .subscribe(
          (data: any) => {
            this.stock = data;
            console.log(this.stock);
            if(this.stock.null){
              document.getElementById("error-message").innerHTML = this.stock.null.error.message;
            }else{
              this.stockChanged.emit(this.stock.F);
            }
          }
      );

/*    return this.http.get('http://data.benzinga.com/rest/richquoteDelayed?symbols=' + this.symbol)
      .map((response: Response) => response.json())
      .subscribe(
          (data: any) => {
            let jsonObject = data;

/!*            this.keys = Object.keys(jsonObject);
            this.stockSymbol = <string>this.keys[0];
            console.log(this.stockSymbol);*!/


            this.stock = new Stock(jsonObject.JNJ.symbol,
              jsonObject.JNJ.name,
              jsonObject.JNJ.bidPrice,
              jsonObject.JNJ.askPrice,
            );
            console.log(this.stock);

            this.stockChanged.emit(this.stock);
          }
      );*/

/*    return this.http.get('http://data.benzinga.com/rest/richquoteDelayed?symbols=' + this.symbol)
    .map((response: Response) => response.json())
    .subscribe(
        (data: any) => {
          this.stock = data;
          console.log(this.stock);
/!*          this.stockChanged.emit(this.stock.F);*!/
        }
    );*/

  }

  viewLookup(symbol){
    console.log(symbol);
    console.log('I did a view lookup');

    return this.http.get('http://data.benzinga.com/rest/richquoteDelayed?symbols=' + symbol)
    .map((response: Response) => response.json())
    .subscribe(
        (data: any) => {
          this.stock = data;
          console.log(this.stock);

          this.stockChanged.emit(this.stock.MSFT);
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

