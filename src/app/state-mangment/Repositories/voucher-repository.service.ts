import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootReducerState, getVoucherFinancialMonth, getVoucherFinancialYear, getVoucherState, getVoucherType } from '../reducers';
import { VoucherFinancialMonthAction, VoucherFinancialYearAction, VoucherStateAction, VoucherTypeAction } from '../actions/voucher-action';

@Injectable({
  providedIn: 'root'
})
export class VoucherRepositoryService {

  constructor(private store: Store<RootReducerState>) { }

  setVoucherTypeCode(voucherCode:number){
    this.persistState();
    this.store.dispatch(new VoucherTypeAction(voucherCode));
  }

  setVoucherFinancialMonth(monthCode: number){
    this.persistState();
    this.store.dispatch(new VoucherFinancialMonthAction(monthCode));
  }

  setVoucherFinancialYear(yearCode: number){
    this.persistState();
    this.store.dispatch(new VoucherFinancialYearAction(yearCode));
  }

  getSelectedVoucherTypeCode(){
    return this.store.select(getVoucherType);
  }

  getSelectedVoucherFinancialYear(){
    return this.store.select(getVoucherFinancialYear);
  }

  getSelectedVoucherFinancialMonth(){
    return this.store.select(getVoucherFinancialMonth);
  }

  //call this method whenever the store is changed
  private persistState(): void {
    this.store.select(getVoucherState).subscribe(state => {
      localStorage.setItem('voucher_state', JSON.stringify(state));
    })
  }

  restoreState(): void {
    const storedState = localStorage.getItem("voucher_state");
    if (storedState) {
      const state = JSON.parse(storedState);
      this.store.dispatch(new VoucherStateAction(state));
    }
  }
}
