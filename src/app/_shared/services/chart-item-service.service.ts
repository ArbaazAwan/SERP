import { ChartofItemModel } from './../model/model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/internal/Observable';
import { CompanyCodeService } from './company-code.service';
import { BehaviorSubject, Observable } from 'rxjs';
const headers = new HttpHeaders().set(
  'Content-Type',
  'text/plain; charset=utf-8'
);
@Injectable({
  providedIn: 'root',
})
export class ChartItemService {
  constructor(
    private http: HttpClient,
    private companyCodeService: CompanyCodeService
  ) {}

  API_URL = this.companyCodeService.getCookie('apiUrl') || '';
  REPORTING_API_URL =
    this.companyCodeService.getCookie('reportingApiUrl') || '';

  private selectedRowSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  public selectedRow$: Observable<any> = this.selectedRowSubject.asObservable();

  private latestChartOfItemSubject: BehaviorSubject<any> =
    new BehaviorSubject<any>(null);
  public latestData$: Observable<any> =
    this.latestChartOfItemSubject.asObservable();

  getAllChartofItem(): Observable<ChartofItemModel> {
    return this.http.get<ChartofItemModel>(
      `${this.API_URL}api/ChartOfItems/LoadChartOfItemsTree`
    );
  }

  getAllStores(BranchCode: number) {
    return this.http.get(`${this.API_URL}api/ChartOfItems/LoadStores`, {
      params: { BranchCode },
    });
  }
  GetMaxItemCode(parentCode: string) {
    return this.http.get(
      `${this.API_URL}api/ChartOfItems/GetMaxItemCode?ParentItemCode=${parentCode}`,
      {
        // params: { parentCode },
      }
    );
  }
  getItemStores(BranchCode: number, ItemCode: string) {
    return this.http.get(
      `${this.API_URL}api/ChartOfItems/GetItemStores?BranchCode=${BranchCode}&ItemCode=${ItemCode}`
    );
  }

  getItemTax(ItemCode: string) {
    return this.http.get(
      `${this.API_URL}api/Tax/GetItemTaxes?ItemCode=${ItemCode}`
    );
  }

  // used for  Capex Opex
  GetAllItemsforAssetTypes() {
    return this.http.get(
      `${this.API_URL}api/ChartOfItems/GetAllItemsforAssetTypes`
    );
  }

  getAllParentCode() {
    return this.http.get(`${this.API_URL}api/ChartOfItems/LoadParentCode`);
  }

  getAllParentItemCode() {
    return this.http.get(`${this.API_URL}api/ChartOfItems/GetParentItemCode`);
  }
  saveStoreItem(data: any) {
    return this.http.post(
      `${this.API_URL}api/ChartOfItems/SaveItemStores`,
      data,
      {
        params: { ...data },
        responseType: 'text' as 'json',
      }
    );
  }

  saveChartofItem(data: ChartofItemModel, images: File[]): Observable<any> {
    const formData = new FormData();
    let stores;
    let items;
    for (let i = 0; i < images.length; i++) {
      formData.append('files', images[i], images[i].name);
    }

    if (data.stores != null) {
      stores = data.stores.map((store) => ({
        ItemCode: data.ItemCode,
        StoreCode: store.StoreCode,
      }));
    }

    if (data.items != null) {
      items = data.items.map((item) => ({
        ItemCode: data.ItemCode,
        TaxId: item.TaxId,
      }));
    }

    formData.append('items', JSON.stringify(items));

    formData.append('stores', JSON.stringify(stores));

    return this.http.post<any>(
      `${this.API_URL}api/ChartOfItems/CreateNewItem`,
      formData,
      {
        params: { ...data },
        responseType: 'text' as 'json',
      }
    );
  }

  updateChartofItem(
    data: ChartofItemModel,
    images: File[]
  ): Observable<ChartofItemModel> {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('files', images[i], images[i].name);
    }

    const stores = data.stores.map((store) => ({
      ItemCode: data.ItemCode,
      StoreCode: store.StoreCode,
    }));

    const items = data.items.map((item) => ({
      ItemCode: data.ItemCode,
      TaxId: item.TaxId,
    }));
    formData.append('items', JSON.stringify(items));

    formData.append('stores', JSON.stringify(stores));

    return this.http.put<ChartofItemModel>(
      `${this.API_URL}api/ChartOfItems/UpdateNewItem`,
      formData,
      {
        params: { ...data },
        responseType: 'text' as 'json',
      }
    );
  }

  deleteChartofItem(ItemCode: string) {
    return this.http.delete(`${this.API_URL}api/ChartOfItems/DeleteNewItem`, {
      params: { ItemCode },
      responseType: 'text' as 'json',
    });
  }

  GetChartOfItemsTree() {
    return this.http.get<ChartofItemModel>(
      `${this.API_URL}api/ChartOfItems/GetChartOfItemsTree`
    );
  }

  CreateNewItemRecipeMaster(data: any) {
    return this.http.post(
      `${this.API_URL}api/Recipe/CreateNewItemRecipeMaster`,
      data,
      {
        params: { ...data },
        responseType: 'text' as 'json',
      }
    );
  }

  UpdateItemRecipeMaster(data: any) {
    return this.http.put(
      `${this.API_URL}api/Recipe/UpdateItemRecipeMaster`,
      data,
      {
        params: { ...data },
        responseType: 'text' as 'json',
      }
    );
  }

  DeleteItemRecipeMaster(RecipeCode: number, ItemCode: string) {
    return this.http.delete(
      `${this.API_URL}api/Recipe/DeleteItemRecipeMaster?RecipeCode=${RecipeCode}&ItemCode=${ItemCode}`
    );
  }

  GetItemRecipeMasterDetails(ItemCode: number) {
    return this.http.get(
      `${this.API_URL}api/Recipe/GetItemRecipeMasterDetails?ItemCode=${ItemCode}`
    );
  }

  CreateNewItemRecipeDetails(data: any) {
    return this.http.post(
      `${this.API_URL}api/Recipe/CreateNewItemRecipeDetails`,
      data,
      {
        params: { ...data },
        responseType: 'text' as 'json',
      }
    );
  }

  UpdateItemRecipeDetail(data: any) {
    return this.http.put<ChartofItemModel>(
      `${this.API_URL}api/Recipe/UpdateItemRecipeDetail`,
      data,
      {
        params: { ...data },
        responseType: 'text' as 'json',
      }
    );
  }
  DeleteItemRecipeDetail(RecipeCode: number, ItemCode: string) {
    return this.http.delete(
      `${this.API_URL}api/Recipe/DeleteItemRecipeDetail?RecipeCode=${RecipeCode}&ItemCode=${ItemCode}`
    );
  }

  GetMaxRecipeCode(ItemCode: string) {
    return this.http.get(
      `${this.API_URL}api/Recipe/GetMaxRecipeCode?ItemCode=${ItemCode}`,
      {
        // params: { parentCode },
      }
    );
  }

  GetDataByItemCode(itemCode: string) {
    const url = `${this.API_URL}api/ChartOfItems/GetDataChartOfItemsByItemCode?ItemCode=${itemCode}`;
    return this.http.get(url, { responseType: 'json' });
  }

  getItemDetailByItemCode(itemCode: string) {
    const url = `${this.API_URL}api/ChartOfItems/GetItemDetails?ItemCode=${itemCode}`;
    return this.http.get(url, { responseType: 'json' });
  }

  getCategoryByItemCode(itemCode: string) {
    const url = `${this.API_URL}api/ChartOfItems/GetCategoryByItemCode?ItemCode=${itemCode}`;
    return this.http.get(url, { responseType: 'json' });
  }
  GetImageByItemCode(itemCode: string): Observable<any> {
    const url = `${this.API_URL}api/ChartOfItems/GetChartOfItemsTreeByItemCode?ItemCode=${itemCode}`;
    return this.http.get(url, { responseType: 'arraybuffer' });
  }

  setSelectedRow(rowData: any): void {
    if (rowData.ChartOfItems) {
      rowData.ChartOfItems.forEach((item: any) => {
        delete item.ItemImagePath;
      });
    }
    this.selectedRowSubject.next(rowData);
  }
}
