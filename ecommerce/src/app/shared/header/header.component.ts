import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/modules/ecommerce-guest/_services/cart.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public router: Router,
    public cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.cartService.currentDataCart$.subscribe((resp: any) => {
      console.log(resp);

    })
  }

  isHome() {
    return this.router.url == "" || this.router.url == "/" ? true : false;
  }
}
