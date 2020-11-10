import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
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

  // service method called from ProductListComponent
  getProductList(theCategoryId: number): Observable<Product[]> {

    // build url based on the category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductListPaginate(thePage: number, 
                        thePageSize: number, 
                        theCategoryId: number): Observable<GetResponseProducts> {

    // build url based on the category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  // service method called from ProductCategoryMenuComponent
  getProductCategories(): Observable<ProductCategory[]> { 
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
    
  }

  searchProducts(theKeyword: string): Observable<Product[]>{
    // build url based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  // method called from the product-details.component.ts
  getProduct(theProductId: number): Observable<Product> {
    // need to build URL based on the product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  searchProductListPaginate(thePage: number, 
                            thePageSize: number, 
                            theKeyword: string): Observable<GetResponseProducts> {

  // build url based on the keyword, page and size
  const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    +`&page=${thePage}&size=${thePageSize}`;

  return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
}

// interfaces to unwrap the JSON from Spring Data REST _embedded entry
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  // support for pagination
  page: {
    size: number,
    totlElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}