import { Component, OnInit } from '@angular/core';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';

@Component({
  selector: 'app-assets-identification',
  templateUrl: './assets-identification.component.html',
  styleUrls: ['./assets-identification.component.scss']
})
export class AssetsIdentificationComponent implements OnInit {
  Assetscharth:any;

  constructor(    private apiService: ApiProviderService,) { }

  ngOnInit(): void {

    this.apiService.get(ApiEndpoints.GetAllItemsforAssetTypes).subscribe(res=>{
      this.Assetscharth=res;
    })
  }
  getRow() {}
  deleteChartItem(){}
}
