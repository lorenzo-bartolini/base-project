import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { <%= classify(name) %>ListComponent } from './<%= dasherize(name) %>-list/<%= dasherize(name) %>-list.component';
import { <%= classify(name) %>DetailComponent } from './<%= dasherize(name) %>-detail/<%= dasherize(name) %>-detail.component';
import { <%= classify(name) %>RoutingModule } from './<%= dasherize(name) %>-routing.module';

@NgModule({
  declarations: [
    <%= classify(name) %>ListComponent,
    <%= classify(name) %>DetailComponent
  ],
  imports: [
    CommonModule,
    <%= classify(name) %>RoutingModule
  ],
  exports: [
    <%= classify(name) %>ListComponent
    <%= classify(name) %>DetailComponent
  ]
})
export class <%= classify(name) %>Module { }
