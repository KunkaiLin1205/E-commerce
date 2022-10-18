import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  //service to get product list
  //getProductList(theCategoryId: number): Observable<Product[]> {
    //build URL based on id
  //  const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

  //  return this.getProducts(searchUrl);
  //}

  //service to get the categories
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategories>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  //service to search product by keyword
  //searchProducts(theKeyword: string): Observable<Product[]> {
  //  const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
  //
  //  return this.getProducts(searchUrl);
  //}

  //service to get the detail view of product depends on input id
  getProduct(theProductId: number): Observable<Product> {
    //build URL based on id
    const searchUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(searchUrl);
  }

  //service to get paginated product lists
  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts> {
    //build URL based on id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  //service to get paginated product lists by keyword
  searchProductsPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts> {
    //build URL based on keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}` + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  //helper function to call httpClient function
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
  page: {
    size: number;
    totalElements: number;
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategories {
  _embedded: {
    productCategory: ProductCategory[];
  }
}