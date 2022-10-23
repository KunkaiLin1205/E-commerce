import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent implements OnInit {
  
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetail()
  }

  listCartDetail() {
    //access to the cart items w/ service
    this.cartItems = this.cartService.cartItems;

    //subscribe to the cart total price and quantity
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    //compute the total price and quantity
    this.cartService.computeCartTotals();
  }

  //increment the chosen item's quantity by one
  incrementQuantity(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem);
  }

  //decrement the chosen item's quantity by one
  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrease(theCartItem);
  }

  //remove the chosen item
  removeItem(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
  }
}
