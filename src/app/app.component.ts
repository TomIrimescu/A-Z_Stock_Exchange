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

  public constructor( private stockService: StockService){
    this.Portfolio = [];
  }

  public  ngOnInit () {

    sessionStorage.setItem('cash', '100000.13');
    this.cash = parseFloat(sessionStorage.getItem('cash'));
    this.cash = ((this.cash)-(.13));
    console.log(typeof (this.cash)); /*testing*/
    console.log(this.cash); /*testing*/

/*    this.Portfolio.push(
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
    );*/

    this.subscription = this.stockService.stockChanged.subscribe(
        (stock: Stock) => this.stock = stock
    );

    console.log(this.stock); /*testing*/

  }

  onSymbolLookup(symbol){
    document.getElementById("message").innerHTML = '';
    document.getElementById("error-message").innerHTML = '';
    var lookupElement = <HTMLInputElement>document.getElementById("lookup");
    lookupElement.value = '';
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

  getQuantities(item,index) {
    var stockQuantity = [item.quantity];
    var arrayLength = stockQuantity.length;
    for (var i = 0; i < arrayLength; i++) {
      var quantities = stockQuantity[i];
    }
    return quantities;
  }

  getValues(item,index) {
    var stockValue = [item.value];
    var arrayLength = stockValue.length;
    for (var i = 0; i < arrayLength; i++) {
      var values = stockValue[i];
    }
    return values;
  }

  onBuy(stockSym, stockName, BID, ASK, stockQuantity) {
    if (stockSym === 'Symbol') {
      var quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
      quantityElement.value = '';
      return;
    } else {
      document.getElementById("error-message").innerHTML = '';
      if ((this.cash >= stockQuantity * ASK) && (stockQuantity > 0)) {
        console.log(this.Portfolio.map(this.getSymbols));/*testing*/
        console.log(this.Portfolio.map(this.getQuantities));/*testing*/
        console.log(this.Portfolio.map(this.getValues));/*testing*/
        var buySymbols = this.Portfolio.map(this.getSymbols);
        var buyQuantities = this.Portfolio.map(this.getQuantities);
        var buyValues = this.Portfolio.map(this.getValues);
        var arrayLength = buySymbols.length;
        for (var i = 0; i < arrayLength; i++) {
          console.log(buySymbols[ i ]);/*testing*/
          console.log(buyQuantities[ i ]);/*testing*/
          console.log(buyValues[ i ]);/*testing*/
          if (buySymbols[ i ] == stockSym) {
            console.log(stockSym);/*testing*/
            console.log('This is a stock update');/*testing*/
            console.log(this.Portfolio[ i ].stock.symbol);/*testing*/

            var totalQuantity: number = parseFloat(stockQuantity) + parseFloat(buyQuantities[ i ]);
            console.log('Quantity total: ' + totalQuantity);/*testing*/
            var totalValue: number = parseFloat((stockQuantity * ASK) + (buyValues[ i ]));
            console.log('Value total: ' + totalValue);/*testing*/
            this.Portfolio[ i ] = new Holding(new Stock(stockSym, stockName, BID, ASK), totalQuantity, totalValue);

            this.cash = (this.cash) - (stockQuantity * ASK);
            console.log(typeof (this.cash));/*testing*/
            document.getElementById("message").innerHTML = 'Purchased: ' + stockQuantity + ' ' + stockName + ' stock for ' + (stockQuantity * ASK);
            var quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
            quantityElement.value = '';
            return;
          }
        }
        console.log('This is a new stock purchase'); /*testing*/
        this.Portfolio.push(new Holding(new Stock(stockSym, stockName, BID, ASK), stockQuantity, (stockQuantity * ASK)));
        this.cash = (this.cash) - (stockQuantity * ASK);
        console.log(typeof (this.cash));/*testing*/
        document.getElementById("message").innerHTML = 'Purchased: ' + stockQuantity + ' ' + stockName + ' stock for ' + (stockQuantity * ASK);
        var quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
        quantityElement.value = '';

      } else if(stockQuantity == 0) {
        document.getElementById("message").innerHTML = '<span style="color: lightsalmon;">Select a quantity</span>';
        var quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
        quantityElement.value = '';
        return;
      } else{
        document.getElementById("message").innerHTML = '<span style="color: lightsalmon;">You will exceed <br>your' +
            ' available cash!</span>';
        var quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
        quantityElement.value = '';
      }
    }

  }

  onSell(stockSym, stockName, BID, ASK, stockQuantity) {
    if (stockSym === 'Symbol') {
      var quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
      quantityElement.value = '';
      return;
    } else if(stockQuantity == 0){
      document.getElementById("message").innerHTML = '<span style="color: lightsalmon;">Select a quantity</span>';
      var quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
      quantityElement.value = '';
      return;
    } else {
      document.getElementById("message").innerHTML = '';
      document.getElementById("error-message").innerHTML = '';
/*    console.log(this.Portfolio.map(this.getSymbols)); /!*testing*!/
      console.log(this.Portfolio.map(this.getQuantities)); /!*testing*!/
      console.log(this.Portfolio.map(this.getValues)); /!*testing*!/*/
      var sellSymbols = this.Portfolio.map(this.getSymbols);
      var sellQuantities = this.Portfolio.map(this.getQuantities);
      var sellValues = this.Portfolio.map(this.getValues);
      var arrayLength = sellSymbols.length;
      for (var i = 0; i < arrayLength; i++) {
/*        console.log(sellSymbols[ i ]);/!*testing*!/
        console.log(sellQuantities[ i ]);/!*testing*!/
        console.log(sellValues[ i ]);/!*testing*!/*/
        if (sellSymbols[ i ] == stockSym) {
/*          console.log(stockName); /!*testing*!/
          console.log(stockSym); /!*testing*!/
          console.log(stockQuantity); /!*testing*!/
          console.log('This is current stock sale'); /!*testing*!/
          console.log(this.Portfolio[i].stock.symbol); /!*testing*!/*/

          if((sellQuantities[ i ]) >= stockQuantity){
              var totalQuantity: number = parseFloat(sellQuantities[ i ]) - parseFloat(stockQuantity);
/*              console.log('Quantity total: ' + totalQuantity);/!*testing*!/*/
              var totalValue: number = (sellValues[ i ]) - (stockQuantity * BID);
/*              console.log('Value total: ' + totalValue);/!*testing*!/*/

              this.Portfolio[ i ] = new Holding(new Stock(stockSym, stockName, BID, ASK), totalQuantity, totalValue);

              this.cash = (this.cash) + (stockQuantity * BID);
/*              console.log(typeof (this.cash));/!*testing*!/*/
              document.getElementById("message").innerHTML = 'Sold: ' + stockQuantity + ' ' + stockName + ' stock for ' + (stockQuantity * BID);
              var quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
              quantityElement.value = '';
              return;
          }
        }
      }
       document.getElementById("message").innerHTML = '<span style="color: lightsalmon;">You cannot make<br>' +
       'this trade!</span>';
       var quantityElement = <HTMLInputElement>document.getElementById("quantityStock");
       quantityElement.value = '';
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }


}
