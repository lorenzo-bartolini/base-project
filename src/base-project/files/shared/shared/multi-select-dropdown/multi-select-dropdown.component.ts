import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MultiSelectDropdownComponent,
      multi: true
    }
  ],
})
export class MultiSelectDropdownComponent implements OnInit, ControlValueAccessor {

  @Input() items?: any[]

  @Input() firstSelectionViewField!: string;
  @Input() firstSelectionLabel!: string;
  @Input() secondSelectionViewField!: string;
  @Input() secondSelectionFieldWhereList!: string;
  @Input() showSecondSelection?: boolean = false
  @Input() secondSelectionLabel?: string;
  @Input() noUsers?: boolean;
  @Input() disableChipList?: boolean;
  @Input() label?: string;
  @Input() style?: string;
  @Input() labelRequest?: string;

  currentValues: any[] = []
  disabled?: boolean;

  form: FormGroup
  separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      main: null,
      second: null
    })
   }

  ngOnInit(): void {
    if(!this.showSecondSelection){
      this.form.get('main')?.valueChanges.subscribe(value => {
        if(value){
          console.log("value : ",value);
          this.currentValues === null? this.currentValues = []: console.log("nisba");
          this.currentValues.push(value)
          this.onChange(this.currentValues)
          this.form.reset({
            main: null,
            second: null
          })
          this.form.updateValueAndValidity()
          console.log("currentValues :",this.currentValues);
        }
      })
    }
  }

  get secondSelectionList(){
    return this.form.get('main')?.value[this.secondSelectionFieldWhereList]
  }

  add(){
    this.currentValues.push({
      ...this.form.get('main')?.value,
      [this.secondSelectionFieldWhereList]: this.form.get('second')?.value
    })
    this.onChange(this.currentValues)
    this.form.reset()
  }

  remove(item: any): void {
    const index = this.currentValues.indexOf(item);
    if (index >= 0) {
      this.currentValues.splice(index, 1);
      this.onChange(this.currentValues)
    }
  }


  //--------ControlValueAccessor things -------------------->
  onChange = (value: any[]) => {};

  onTouched = () => {};

  writeValue(obj: any): void {
    // console.log("WRITE VALUE --> ", this.currentValues);
    this.currentValues = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
