import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import {%= classify(name) %>DetailComponent } from './<%= dasherize(name) %>-detail/<%= dasherize(name) %>-detail.component';
import {%= classify(name) %>ListComponent } from './<%= dasherize(name) %>-list/<%= dasherize(name) %>-list.component';
import {%= classify(name) %>RoutingModule } from './<%= dasherize(name) %>-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

const MATERIAL_MODULES = [
  MatIconModule,
  MatFormFieldModule,
  MatRadioModule,
  MatTableModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatTabsModule,
  MatExpansionModule,
  MatAutocompleteModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatButtonModule
]

@NgModule({
  declarations: [
    <%= classify(name) %>ListComponent,
    <%= classify(name) %>DetailComponent
  ],
  imports: [
    MATERIAL_MODULES,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    CommonModule,
    <%= classify(name) %>RoutingModule
  ],
  exports: [
    <%= classify(name) %>ListComponent
    <%= classify(name) %>DetailComponent
  ]
})
export class <%= classify(name) %>Module { }
