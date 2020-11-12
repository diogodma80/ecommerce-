import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  // Subject is a subclass of Observable. It allows to publish events in the code and send them to all subscribers
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {
    // check if there is already the item in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if(this.cartItems.length > 0) {
      // find the item in the cart based on the item id
      //find will return the first element that passes. Otherwise it returns undefined
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      // check if there item is found
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart) {
      // increment the quantity of that item
      existingCartItem.quantity++;
    } else {
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }

    // compute the cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contents of the cart`);
    for(let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name=${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice=${totalPriceValue.toFixed(2)}, totalQuantity=${totalQuantityValue}`);
    console.log('------------------------------');
  }
}
