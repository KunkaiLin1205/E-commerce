import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  //add the item to the cart
  addToCart(theCartItem: CartItem) {
    //check if the item added is already in the cart
    let exist: boolean = false;
    let existingItem: CartItem = theCartItem;

    if (this.cartItems.length > 0) {
      for (let item of this.cartItems) {
        if (item.id == theCartItem.id) {
          existingItem = item;
          exist = true;
          break;
        }
      }
    }

    if (exist) {
      existingItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }

  //update the data of cart: totalPrice and totalQuantity
  computeCartTotals() {
    let priceSum: number = 0;
    let quantitySum: number = 0;
    for (let item of this.cartItems) {
      priceSum += item.quantity * item.unitPrice;
      quantitySum += item.quantity;
    }

    this.totalPrice.next(priceSum);
    this.totalQuantity.next(quantitySum);
  }

  //decrease the item's quantity by one
  decrease(theCartItem: CartItem) {
    //since this can only happens if the item exists in the cart, no need to check if it exists
    for (let item of this.cartItems) {
      if (theCartItem.id == item.id) {
        //if the quantity equals to zero after decrement, directly remove it 
        if (item.quantity == 1) {
          this.remove(item);
        } else {
          item.quantity--;
          //update the cart after each decrement
          this.computeCartTotals();
        }
        break;
      }
    }
  }

  //remove the item
  remove(theCartItem: CartItem) {
    
    let index: number = 0;

    //traverse the list to find index of target item
    for (let item of this.cartItems) {
      if (theCartItem.id == item.id) {
        this.cartItems.splice(index, 1);
        break;
      }
      index++;
    }

    //update the cart after removing
    this.computeCartTotals();
  }
}
