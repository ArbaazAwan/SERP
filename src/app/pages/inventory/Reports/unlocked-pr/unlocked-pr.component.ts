import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';

@Component({
  selector: 'app-unlocked-pr',
  templateUrl: './unlocked-pr.component.html',
  styleUrls: ['./unlocked-pr.component.scss']
})
export class UnlockedPRComponent implements OnInit {

  form!: FormGroup;
  selectedStore!: number;
  storeResponse$: any = [];
  globalBranchCode!: number;

  constructor(
    private fb: FormBuilder,
    private apiservice: InventoryReportsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      StoreCode: this.fb.control('', Validators.required),
      DateFrom: this.fb.control('', Validators.required),
      DateTo: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadStores();
  }

  loadStores() {
    this.apiservice.getAllStore(this.globalBranchCode).subscribe((res: any) => {
      this.storeResponse$ = res;
    });
  }
  changeStore(e: any) {
    this.selectedStore = +e.target.value;
  }

  UnlockedPurchaseRequsitionReport() {
    let DateFrom = this.form.get('DateFrom')?.value;
    let DateTo = this.form.get('DateTo')?.value;
    this.apiservice
      .printUnlockedPurchaseRequsitionReport(
        this.globalBranchCode,
        this.selectedStore,
        DateFrom,
        DateTo
      )
      .subscribe((pdf: any) => {
        const file = new Blob([pdf], {
          type: 'application/pdf',
        });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }



}
