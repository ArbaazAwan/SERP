import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-department-division-ref',
  templateUrl: './department-division-ref.component.html',
  styleUrls: ['./department-division-ref.component.scss']
})
export class DepartmentDivisionRefComponent implements OnInit {

  departmentDivisionForm!: FormGroup;

  constructor( private fb: FormBuilder ) {
    this.formInit();
  }

  ngOnInit(): void {
  }

  formInit(): void {
      this.departmentDivisionForm = this.fb.group({
        BranchCode: ['', Validators.required],
        DivisionCode: ['', Validators.required],
        DivisionName: ['', Validators.required],
        ShortName: ['', Validators.required],
        Status: ['', Validators.required],
      })
  }

}
