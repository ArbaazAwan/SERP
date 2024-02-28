import * as fromVoucher from "./voucher-reducer";
//to combine multiple reducers into root reducer
import { ActionReducerMap, createSelector } from "@ngrx/store";


export interface RootReducerState {
  vouchers: fromVoucher.IVoucherReducerState;
}

export const RootReducer: ActionReducerMap<RootReducerState> = {
  vouchers: fromVoucher.VoucherReducer,
};

export const getVoucherState = (state: RootReducerState) => state.vouchers;
export const getVoucherLoading = createSelector(getVoucherState, fromVoucher.getVoucherLoading);
export const getVoucherLoaded = createSelector(getVoucherState, fromVoucher.getVoucherLoaded);
export const getVoucherList = createSelector(getVoucherState, fromVoucher.getVoucherList);
export const getVoucherType = createSelector(getVoucherState, fromVoucher.getVoucherType);
export const getVoucherFinancialYear = createSelector(getVoucherState, fromVoucher.getVoucherFinancialYear);
export const getVoucherFinancialMonth = createSelector(getVoucherState, fromVoucher.getVoucherFinancialMonth);
