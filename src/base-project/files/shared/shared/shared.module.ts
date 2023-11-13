import { MatChipsModule, MAT_CHIP } from '@angular/material/chips';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table/data-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MultiSelectDropdownComponent } from './multi-select-dropdown/multi-select-dropdown.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectSearchComponent } from './select-search/select-search.component';
import { AddressDetailFormComponent } from './address-detail-form/address-detail-form.component';
import { SimpleDialogComponent } from './simple-dialog/simple-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

const SHARED_MODULES = [
  MatTableModule,
  MatPaginatorModule,
  MatButtonModule,
  MatSortModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatChipsModule,
  MatDialogModule,
  // MatLegacyChipsModule
  // MAT_CHIP,
  MatAutocompleteModule,
  MatSelectModule
]

@NgModule({
  declarations: [
    AddressDetailFormComponent,
    DataTableComponent,
    MultiSelectDropdownComponent,
    SelectSearchComponent,
    SimpleDialogComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    HttpClientModule,
    NgxMatSelectSearchModule,
    SHARED_MODULES
  ],
  exports: [
    AddressDetailFormComponent,
    DataTableComponent,
    MultiSelectDropdownComponent,
    SelectSearchComponent,
    SafeHtmlPipe
  ],
  providers: [
  ]
})
export class SharedModule { }
