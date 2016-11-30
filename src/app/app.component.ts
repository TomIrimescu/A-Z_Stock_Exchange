import { Component, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Holding } from "./holding";
import { StockService } from "./stock.service";
import { Stock } from "./stock";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  public Portfolio: Array<Holding>;
  public cash: number;
  public stock: Stock = {
      symbol: 'Stock Symbol',
      name: 'Stock Name',
      bidPrice: 0.00,
      askPrice: 0.00
  };

  private subscription: Subscription;

  public constructor( private stockService: StockService){
    this.Portfolio = [];
  }

  public  ngOnInit () {

    sessionStorage.setItem('cash', '100000.13');
    this.cash = parseFloat(sessionStorage.getItem('cash'));
    this.cash = ((this.cash)-(.13));
    console.log(typeof (this.cash)); /*testing*/
    console.log(this.cash); /*testing*/

    this.Portfolio.push(
        {
          stock: {
            symbol: 'F',
            name: 'Ford Motor',
            bidPrice: 11.92,
            askPrice: 11.93
          },
          "quantity": 13000,
          "value": 13000
        },

        {
          stock: {
            symbol: 'GE',
            name: 'General Electric',
            bidPrice: 20.00,
            askPrice: 21.93
          },
          "quantity": 50,
          "value": 1000
        },

        {
          stock: {
            symbol: 'MSFT',
            name: 'Microsoft',
            bidPrice: 20.00,
            askPrice: 21.93
          },
          "quantity": 5,
          "value": 24.99
        }
    );

    this.subscription = this.stockService.stockChanged.subscribe(
        (stock: Stock) => this.stock = stock
    );

    console.log(this.stock); /*testing*/

  }


  onSymbolLookup(symbol){
    document.getElementById("message").innerHTML = '';
    document.getElementById("error-message").innerHTML = '';
    document.getElementById("lookup").value = "";
    this.stockService.symbolLookup(symbol);
  }

  onViewLookup(symbol){
    document.getElementById("message").innerHTML = '';
    document.getElementById("error-message").innerHTML = '';
    this.stockService.viewLookup(symbol);
  }

  getSymbols(item,index) {
    var stockSymbol = [item.stock.symbol];
    var arrayLength = stockSymbol.length;
    for (var i = 0; i < arrayLength; i++) {
      var symbols = stockSymbol[i];
    }
    return symbols;
  }

  onBuy(stockSym, stockName, BID, ASK, stockQuantity) {
    if (stockSym === 'Stock Symbol') {
      document.getElementById("quantityStock").value = '';
      return;
    } else {
      document.getElementById("error-message").innerHTML = '';
      if (this.cash >= stockQuantity * ASK) {
        console.log(this.Portfolio.map(this.getSymbols)); /*testing*/
        var checkSymbols = this.Portfolio.map(this.getSymbols);
        var arrayLength = checkSymbols.length;
        for (var i = 0; i < arrayLength; i++) {
          console.log(checkSymbols[ i ]); /*testing*/
          if (checkSymbols[ i ] == stockSym) {
            console.log('This is a stock update');
            return;
          }
        }
        console.log('This is a new stock purchase');
        this.Portfolio.push(new Holding(new Stock(stockSym, stockName, BID, ASK), stockQuantity, (stockQuantity * ASK)));
        this.cash = (this.cash) - (stockQuantity * ASK);
        console.log(typeof (this.cash)); /*testing*/
        document.getElementById("message").innerHTML = 'Purchased: ' + stockQuantity + ' ' + stockName + ' stock for ' + (stockQuantity * ASK);
        document.getElementById("quantityStock").value = '';

      } else {
        document.getElementById("message").innerHTML = '<span style="color: lightsalmon;">You will exceed <br>your' +
            ' available cash!</span>';
        document.getElementById("quantityStock").value = '';
        return;
      }
    }
  }

  onSell(stockSym, stockName, BID, ASK, stockQuantity) {
    if (stockSym === 'Stock Symbol') {
      document.getElementById("quantityStock").value = '';
      return;
    } else {
      document.getElementById("error-message").innerHTML = '';
      this.cash = (this.cash) + (stockQuantity * BID);
      console.log(typeof (this.cash)); /*testing*/
      document.getElementById("message").innerHTML = 'Sold: ' + stockQuantity + ' ' + stockName + ' stock for ' + (stockQuantity * BID);
      document.getElementById("quantityStock").value = '';
    }

  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }


}
