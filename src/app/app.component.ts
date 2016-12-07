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
      symbol: 'Symbol',
      name: 'Stock Name',
      bidPrice: 0.00,
      askPrice: 0.00
  };

  private subscription: Subscription;

  public constructor( private stockService: StockService ){
    this.Portfolio = [];
  }

  public  ngOnInit () {
    sessionStorage.setItem('cash', '100000.00');
    this.cash = parseFloat(sessionStorage.getItem('cash'));

    this.subscription = this.stockService.stockChanged.subscribe(
        (stock: Stock) => this.stock = stock
    );

  }

  onSymbolLookup(symbol){
    document.getElementById("message").innerHTML = '';
    document.getElementById("error-message").innerHTML = '';
    let lookupElement = <HTMLInputElement>document.getElementById("lookup");
    lookupElement.value = '';
    this.stockService.symbolLookup(symbol);
  }

  onViewLookup(symbol){
    document.getElementById("message").innerHTML = '';
    document.getElementById("error-message").innerHTML = '';
    this.stockService.viewLookup(symbol);
  }

  getSymbols(item,index) {
    let stockSymbol = [item.stock.symbol];
    let arrayLength = stockSymbol.length;
    for (let i = 0; i < arrayLength; i++) {
      var symbols = stockSymbol[i];
    }
    return symbols;
  }

  getQuantities(item,index) {
    let stockQuantity = [item.quantity];
    let arrayLength = stockQuantity.length;
    for (let i = 0; i < arrayLength; i++) {
      var quantities = stockQuantity[i];
    }
    return quantities;
  }

  getValues(item,index) {
    let stockValue = [item.value];
    let arrayLength = stockValue.length;
    for (let i = 0; i < arrayLength; i++) {
      var values = stockValue[i];
    }
    return values;
  }

  onBuy(stockSym, stockName, BID, ASK, stockQuantity) {
    if (stockSym === 'Symbol') {
      let quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
      quantityElement.value = '';
      return;
    } else {
      document.getElementById("error-message").innerHTML = '';
      if ((this.cash >= stockQuantity * ASK) && (stockQuantity > 0)) {
        let buySymbols = this.Portfolio.map(this.getSymbols);
        let buyQuantities = this.Portfolio.map(this.getQuantities);
        let buyValues = this.Portfolio.map(this.getValues);
        let arrayLength = buySymbols.length;
        for (let i = 0; i < arrayLength; i++) {
          if (buySymbols[ i ] == stockSym) {
            let totalQuantity: number = parseFloat(stockQuantity) + parseFloat(buyQuantities[ i ]);
            let totalValue: number = parseFloat((stockQuantity * ASK) + (buyValues[ i ]));
            this.Portfolio[ i ] = new Holding(new Stock(stockSym, stockName, BID, ASK), totalQuantity, totalValue);
            this.cash = (this.cash) - (stockQuantity * ASK);
            document.getElementById("message").innerHTML = 'Purchased: ' + stockQuantity + ' ' + stockName + ' stock for ' + (stockQuantity * ASK);
            let quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
            quantityElement.value = '';
            return;
          }
        }
        this.Portfolio.push(new Holding(new Stock(stockSym, stockName, BID, ASK), stockQuantity, (stockQuantity * ASK)));
        this.cash = (this.cash) - (stockQuantity * ASK);
        document.getElementById("message").innerHTML = 'Purchased: ' + stockQuantity + ' ' + stockName + ' stock for ' + (stockQuantity * ASK);
        let quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
        quantityElement.value = '';

      } else if (stockQuantity == 0) {
        document.getElementById("message").innerHTML = '<span style="color: lightsalmon;">Select a quantity</span>';
        let quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
        quantityElement.value = '';
        return;
      } else {
        document.getElementById("message").innerHTML = '<span style="color: lightsalmon;">You will exceed <br>your' +
            ' available cash!</span>';
        let quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
        quantityElement.value = '';
      }
    }

  }

  onSell(stockSym, stockName, BID, ASK, stockQuantity) {
    if (stockSym === 'Symbol') {
      let quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
      quantityElement.value = '';
      return;
    } else if(stockQuantity == 0){
      document.getElementById("message").innerHTML = '<span style="color: lightsalmon;">Select a quantity</span>';
      let quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
      quantityElement.value = '';
      return;
    } else {
      document.getElementById("message").innerHTML = '';
      document.getElementById("error-message").innerHTML = '';
      let sellSymbols = this.Portfolio.map(this.getSymbols);
      let sellQuantities = this.Portfolio.map(this.getQuantities);
      let sellValues = this.Portfolio.map(this.getValues);
      let arrayLength = sellSymbols.length;
      for (let i = 0; i < arrayLength; i++) {
        if (sellSymbols[ i ] == stockSym) {
          if((sellQuantities[ i ]) >= stockQuantity){
              let totalQuantity: number = parseFloat(sellQuantities[ i ]) - parseFloat(stockQuantity);
              let totalValue: number = (sellValues[ i ]) - (stockQuantity * BID);
              this.Portfolio[ i ] = new Holding(new Stock(stockSym, stockName, BID, ASK), totalQuantity, totalValue);
              this.cash = (this.cash) + (stockQuantity * BID);
              let purchasePrice: any = (stockQuantity * BID);
              purchasePrice = parseFloat(purchasePrice);
              purchasePrice = purchasePrice.toFixed(2);
              document.getElementById("message").innerHTML = 'Sold: ' + stockQuantity + ' ' + stockName + ' stock' +
                  ' for ' + purchasePrice;
              let quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
              quantityElement.value = '';
              return;
          }
        }
      }
       document.getElementById("message").innerHTML = '<span style="color: lightsalmon;">You cannot make<br>' +
       'this trade!</span>';
       let quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
       quantityElement.value = '';
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
