import { Component, OnInit } from '@angular/core';

declare function customInitFunctions();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  public year:any = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
    customInitFunctions();
  }

}
