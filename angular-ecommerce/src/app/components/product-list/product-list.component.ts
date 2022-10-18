import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;

  //pagination
  thePageNumber: number = 1;
  thePageSize: number = 8;
  numElements: number = 0;
  previousCategoryId: number = 1;
  previousKeyword: string = "";

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=> {
      this.listProducts();
    })
  }
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  updatePageSize(sizeValue: string) {
    this.thePageSize = +sizeValue;
    this.thePageNumber = 1;
    this.listProducts();
  }

  //search by the keyword 
  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
     
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
    
    this.previousKeyword = theKeyword;

    //search using keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword).subscribe(this.process());

    //helper function to return data for pagination
  }

  //just the list of products
  handleListProducts() {
    //check if the "id" parameter is avaliable
    const hasId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!; 
    } else {
      this.currentCategoryId = 1;
    }

    //reset the page numebr if the category id changes
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(this.process());
  }

  private process() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.numElements = data.page.totalElements;
    }
  }
}
