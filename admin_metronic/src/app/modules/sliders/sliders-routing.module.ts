import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SlidersComponent } from './sliders.component';
import { ListSliderComponent } from './list-slider/list-slider.component';


const routes: Routes = [
  {
    path: '',
    component: SlidersComponent,
    children: [
      {
        path: 'lista-sliders',
        component: ListSliderComponent
      }
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlidersRoutingModule { }
