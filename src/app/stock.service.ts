import { Injectable, EventEmitter,  Input, Output, } from '@angular/core';
import { Headers, Http, Response } from "@angular/http";
import 'rxjs/Rx';
import { Stock } from "./stock";
import {Observable} from 'rxjs/Rx';

@Injectable()
export class StockService {

  stockChanged = new EventEmitter<Stock>();
  stock: Stock;

  constructor(private http: Http) { }

  symbolLookup(symbol: string){
    console.log(symbol); /*testing*/
    console.log('I did a symbol lookup'); /*testing*/

      return this.http.get('http://data.benzinga.com/rest/richquoteDelayed?symbols=' + symbol)
      .map((response: Response) => response.json()[ symbol ])
      .subscribe(
          (data: any) => {
            this.stock = data;
            console.log(this.stock); /*testing*/
            if (this.stock === undefined || symbol === 'null') {
              document.getElementById("error-message").innerHTML = 'Unknown symbol';
            } else {
              this.stockChanged.emit(this.stock);
            }
          }
      );

  }

  viewLookup(symbol: string){
    console.log(symbol); /*testing*/
    console.log('I did a view lookup'); /*testing*/

    return this.http.get('http://data.benzinga.com/rest/richquoteDelayed?symbols=' + symbol)
    .map((response: Response) => response.json()[symbol])
    .subscribe(
        (data: any) => {
          this.stock = data;
          console.log(this.stock); /*testing*/
          this.stockChanged.emit(this.stock);
        }
    );

  }

}

