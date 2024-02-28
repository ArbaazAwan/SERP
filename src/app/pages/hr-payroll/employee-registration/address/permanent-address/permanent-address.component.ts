import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-permanent-address',
  templateUrl: './permanent-address.component.html',
  styleUrls: ['./permanent-address.component.scss']
})
export class PermanentAddressComponent implements OnInit {

  @Input() PermanentAddressForm!: FormGroup;
  @Input() countries: Array<any> = [];
  @Input() states: Array<any> = [];
  @Input() cities: Array<any> = [];
  constructor() { }

  ngOnInit(): void {
  }

}
