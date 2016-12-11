import { Injectable, EventEmitter} from '@angular/core';
import { Headers, Http, Response } from "@angular/http";
import 'rxjs/Rx';
import { Stock } from "./stock";
import {Observable, Subscription} from 'rxjs/Rx';

@Injectable()
export class StockService {

  stockChanged = new EventEmitter<Stock>();
  stock: Stock;

  constructor(private http: Http) { }

  symbolLookup(symbol: string){
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
      return this.http.get('stocks.json', {headers: headers})
      .map((response: Response) => response.json()[symbol])
      .subscribe(
          (data: any) => {
            this.stock = data;
            if (this.stock === undefined || symbol === 'null') {
              document.getElementById("error-message").innerHTML = 'Unknown Symbol';
            } else {
              this.stockChanged.emit(this.stock);
            }
          }
      );

  }

  viewLookup(symbol: string){
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.get('stocks.json', {headers: headers})
    .map((response: Response) => response.json()[symbol])
    .subscribe(
        (data: any) => {
          this.stock = data;
          this.stockChanged.emit(this.stock);
        }
    );

  }

}

