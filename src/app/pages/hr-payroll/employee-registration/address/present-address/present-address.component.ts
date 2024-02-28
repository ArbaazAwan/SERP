import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-present-address',
  templateUrl: './present-address.component.html',
  styleUrls: ['./present-address.component.scss']
})
export class PresentAddressComponent implements OnInit {

  @Input() PresentAddressForm!: FormGroup;
  @Input() states: Array<any> = [];
  @Input() countries: Array<any> = [];
  @Input() cities: Array<any> = [];

  constructor() { }

  ngOnInit(): void {
  }

}
