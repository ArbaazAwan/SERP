import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';

@Component({
  selector: 'app-stock-img',
  templateUrl: './stock-img.component.html',
  styleUrls: ['./stock-img.component.scss'],
})
export class StockImgComponent implements OnInit {
  form!: FormGroup;
  selectedStore!: number;
  selectedCOA!: number;
  storeResponse$: any = [];
  COAResponse$: any = [];
  globalBranchCode!: number;
  globalUser!: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiservice: InventoryReportsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      StoreCode: this.fb.control('', Validators.required),
      ItemCode: this.fb.control('', Validators.required),
      StockOnDate: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUser = +localStorage.getItem('UserId')!;
    this.loadStores();
    this.loadCOAHead();
  }

  loadStores() {
    this.apiservice.getAllStore(this.globalBranchCode).subscribe((res: any) => {
      this.storeResponse$ = res.data;
    });
  }
  changeStore(e: any) {
    this.selectedStore = +e.target.value;
  }

  loadCOAHead() {
    this.apiservice.getCOAHeads(this.globalBranchCode).subscribe((res: any) => {
      this.COAResponse$ = res.data;
    });
  }

  changeCOA(e: any) {
    this.selectedCOA = +e.target.value;
  }
  StocktWithImages() {
    let StockOnDate = this.form.get('StockOnDate')?.value;
    this.loading = true;
    this.apiservice
      .printStocktWithImages(
        this.globalBranchCode,
        this.selectedStore,
        StockOnDate,
        this.selectedCOA,
        this.globalUser
      )
      .subscribe((pdf: any) => {
        const file = new Blob([pdf], {
          type: 'application/pdf',
        });
        this.loading = false;
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
}
