import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-arrears',
  templateUrl: './employee-arrears.component.html',
  styleUrls: ['./employee-arrears.component.scss']
})
export class EmployeeArrearsComponent implements OnInit {
  componentName: string = "employee arrears";

  constructor() { }

  ngOnInit(): void {
  }
}
