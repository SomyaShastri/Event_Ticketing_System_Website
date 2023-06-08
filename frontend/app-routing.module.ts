import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Component1Component } from './component1/component1.component';
import { Component2Component } from './favourite/favourite.component';

const routes: Routes = [
   
    { path: 'search', component: Component1Component },
    { path: 'favourites', component: Component2Component },
    { path: '',   redirectTo: '/search', pathMatch: 'full' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
