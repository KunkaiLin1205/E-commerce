import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0.0;
  totalQuantity: number = 0;
  
  years: number[] = [];
  months: number[] = [];
  countries: Country[] = [];
  states: State[] = [];
  shippingStates: State[] = [];
  billingStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private formService: FormService,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.reviewCart();
    
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    //get months list from service
    this.formService.getMonths().subscribe(
      data => {
        this.months = data;
      }
    );
    
    //get years list from service
    this.formService.getYears().subscribe(
      data => {
        this.years = data;
      }
    );

    //get countries list from service
    this.formService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );
    
  }

  //set the cart review with cartService
  reviewCart() {
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  getStates(fName: string) {
    const fGroup = this.checkoutFormGroup.get(fName);

    const code = fGroup?.value.country.code;

    this.formService.getStates(code).subscribe(
      data => {
        if (fName == 'shippingAddress') {
          this.shippingStates = data;
        } else {
          this.billingStates = data;
        }

        fGroup?.get('state')?.setValue(data[0]);
      }
    );
  }


  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')!.value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer')!.value.email);
  }
}

