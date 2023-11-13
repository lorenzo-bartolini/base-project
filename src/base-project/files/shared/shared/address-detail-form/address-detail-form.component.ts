import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-address-detail-form',
  templateUrl: './address-detail-form.component.html',
  styleUrls: ['./address-detail-form.component.scss']
})
export class AddressDetailFormComponent implements OnInit {

  @Input() form!: FormGroup;
  @Input() isNew!: boolean;
  @Input() type!: string;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log("TIPO --> ADDDR", this.type, this.isNew);
    if (this.isNew === false) {
      let fields = ['city', 'streetName', 'streetNumber', 'province', 'country', 'zip', 'state' ];
      fields.forEach(field => {
        this.form.get(field)?.disable();
        this.form.updateValueAndValidity();
      })
    }

  }

  get addressValid(){
    let streetName = this.form.get('streetName')?.value ? true: false;
    let streetNumber = this.form.get('streetNumber')?.value ? true: false;
    let zip = this.form.get('zip')?.value ? true: false;
    let city = this.form.get('city')?.value ? true: false;
    //let state = this.form.get('state')?.value ? true: false;
    let country = this.form.get('country')?.value ? true: false;

    let latExists = this.form.get('coordX')?.value ? true: false;
    let longExists = this.form.get('coordY')?.value ? true: false;

    let addressValid;
    if(!streetName || !streetNumber || !zip || !city || /* !state || */ !country){
      addressValid = 'red';
    }else if(!latExists || !longExists){
      addressValid = 'yellow';
    }else{
      addressValid = 'green';
    }


    return addressValid
  }

}
