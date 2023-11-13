import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDetailFormComponent } from './address-detail-form.component';

describe('AddressDetailFormComponent', () => {
  let component: AddressDetailFormComponent;
  let fixture: ComponentFixture<AddressDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressDetailFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
