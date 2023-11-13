import { Component,ViewChild, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectSearchComponent,
      multi: true
    }
  ],
})
export class SelectSearchComponent implements OnInit, OnChanges,ControlValueAccessor {
  @ViewChild('singleSelect') matSelect?: MatSelect

  @Input() items?: any[]
  @Input() noMatchLabel?: string;
  @Input() viewField!: string;
  @Input() label?: string;
  @Input() noUsers?: boolean;
  @Input() disable?: boolean;
  @Input() class?: string;
  @Input() style?: string

  currentValue: any;
  disabled?: boolean;

  filterControl: FormControl = new FormControl();

  filteredItems: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.filteredItems.next(this.items!.slice());

    // listen for search field value changes
    this.filterControl.valueChanges
      .subscribe(() => {
        this.filterItems();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(!(changes['items'] == null) && (changes['items'].currentValue !== changes['items'].previousValue)){
        this.filteredItems.next(this.items!.slice());
      }
  }

  selectionChanged(event: any){
    this.onChange(event.value)
  }


  protected filterItems() {
    if (!this.items) {
      return;
    }
    // get the search keyword
    let search = this.filterControl.value;
    if (!search) {
      this.filteredItems.next(this.items.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    if (this.viewField === 'descx' || this.viewField === 'uiLabel'  ) {
      this.filteredItems.next(
        this.items.filter(item => this.viewField !== '' ?
          this.translate.instant('LABEL.' + item[this.viewField]).toLowerCase().indexOf(search) > -1:
          item.toLowerCase().indexOf(search) > -1)
      );
    } else {
      this.filteredItems.next(
        this.items.filter(item => this.viewField !== '' ?
          item[this.viewField].toLowerCase().indexOf(search) > -1:
          item.toLowerCase().indexOf(search) > -1)
      );
    }

  }

  //--------ControlValueAccessor things -------------------->
  onChange = (value: any) => {};

  onTouched = () => {};

  writeValue(obj: any): void {
    this.currentValue = obj;
    if(obj === null && this.matSelect !== undefined){
      this.matSelect.value = []
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
