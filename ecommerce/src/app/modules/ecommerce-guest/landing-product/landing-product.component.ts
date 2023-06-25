import { Component, OnInit } from '@angular/core';
import { EcommerceGuestService } from '../_services/ecommerce-guest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../_services/cart.service';

declare var $: any;
declare function LandingProductDetail(): any;
declare function ModalProductDetail(): any;
@Component({
  selector: 'app-landing-product',
  templateUrl: './landing-product.component.html',
  styleUrls: ['./landing-product.component.css']
})
export class LandingProductComponent implements OnInit {

  slug: any = null;
  product_selected: any = null;
  product_selected_modal: any = null;
  related_products: any = [];
  variedad_selected: any = null;
  constructor(
    public ecommerce_guest: EcommerceGuestService,
    public router: Router,
    public routerActived: ActivatedRoute,
    public cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.routerActived.params.subscribe((resp: any) => {
      this.slug = resp["slug"];
    })
    console.log(this.slug);
    this.ecommerce_guest.showLandingProduct(this.slug).subscribe((resp: any) => {
      console.log(resp);
      this.product_selected = resp.product;
      this.related_products = resp.related_products;
      setTimeout(() => {
        LandingProductDetail();
      }, 50);
    })
  }
  OpenModal(bestProd: any, FlashSale: any = null) {
    this.product_selected_modal = null;

    setTimeout(() => {
      this.product_selected_modal = bestProd;
      this.product_selected_modal.FlashSale = FlashSale;
      setTimeout(() => {
        ModalProductDetail();

      }, 50);
    }, 100);

  }
  getCalNewPrice(product: any) {
    // if (this.FlashSale.type_discount == 1) {
    //   return product.price_euros - product.price_euros * this.FlashSale.discount * 0.01;
    // } else {
    //   return product.price_euros - this.FlashSale.discount;
    // }
    return 0;
  }
  selectedVariedad(variedad: any) {
    console.log(variedad);
    
    this.variedad_selected = variedad;
  }

  addCart(product: any) {
    console.log(product);
    if (!this.cartService._authService.user) {
      alert("Necesitas autenticarte para poder agregar el producto al carrito");
      return;
    }
    if ($("#qty-cart").val() == 0) {
      alert("Necesitas necesitas agregar una cantidad mayor a 0 del producto para el carrito");
      return;
    }
    if (this.product_selected.type_inventario == 2) {
      if (!this.variedad_selected) {
        alert("Necesitas necesitas seleccionar una variedad para el producto");
        return;
      }
      if (this.variedad_selected) {
        if (this.variedad_selected.stock < $("#qty-cart").val()) {
          alert("Necesitas necesitas agregar una cantidad menor. En estos momentos no disponemos del Stock suficiente");
          return;
        }
      }
    }
    let data = {
      user: this.cartService._authService.user._id,
      product: this.product_selected._id,
      type_discount: "",
      discount: 0,
      cantidad: $("#qty-cart").val(),
      variedad: this.variedad_selected ? this.variedad_selected._id : "",
      code_cupon: "",
      code_discount: "",
      price_unitario: this.product_selected.price_euros,
      subtotal: this.product_selected.price_euros * $("#qty-cart").val(),
      total: this.product_selected.price_euros * $("#qty-cart").val(),
    }
  
    this.cartService.registerCart(data).subscribe((resp: any) => {
      if (resp.message == 403) {
        alert(resp.message_text);
        return;
      } else {
        this.cartService.changeCart(resp.cart);
      }
    })
  }
}
