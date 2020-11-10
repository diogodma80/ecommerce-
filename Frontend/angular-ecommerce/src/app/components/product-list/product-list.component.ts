import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number = 1;
  searchMode: boolean = false;
  thePreviousCategoryId: number = 1;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  
  previousKeyword: string = null;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    //gets the keyword from the UI
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // if we have a different keyword than previous, then set thePageNumber to 1
    if(this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    // keep track of the keyword
    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    // now search for the products using the keyword
    this.productService.searchProductListPaginate(this.thePageNumber -1, 
                                                  this.thePageSize,
                                                  theKeyword).subscribe(this.processResult());
  }

  handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      // get the "id" param string and convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      // no category id is available ... default to category id of 1
      this.currentCategoryId = 1;
    }

    // check if we have different category than previous
    // Angular will reuse the componenet if it is currently being viewed
    // if there is a different category id than the previous, then reset thePageNumber back to 1
    if(this.thePreviousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.thePreviousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);



    // now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1, 
                                              this.thePageSize, 
                                              this.currentCategoryId).subscribe(this.processResult());
  }

  processResult() {
    return data => {
      // class_property = Spring_Data_REST_JSON_data
      this.products = data._embedded.products;
      this.thePageSize = data.page.size;
      this.thePageNumber = data.page.number + 1; // Spring Data REST pages are 0 based
      this.theTotalElements = data.page.totalElements;
    };
  }

  // method called by the select component
  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

}
