import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {

  @Input() Addresses!: FormGroup;
  @Input() cities: any = [];
  @Input() countries: any = [];
  @Input() states: any = [];
  get PresentAddressForm(): FormGroup { return this.Addresses.get('PresentAddressForm') as FormGroup }
  get PermanentAddressForm(): FormGroup { return this.Addresses.get('PermanentAddressForm') as FormGroup }

  constructor() { }

  ngOnInit(): void { }
}
