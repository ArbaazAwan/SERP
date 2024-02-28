import { Action } from "../actions";
import { 
  VOUCHER_FINANCIAL_MONTH,
    VOUCHER_FINANCIAL_YEAR,
    VOUCHER_LIST_LOADING, 
    VOUCHER_LIST_SUCCESS, 
    VOUCHER_STATE, 
    VOUCHER_TYPE
    } from "../actions/voucher-action";

export interface IVoucherReducerState{
    VoucherList: any;
    VoucherType: any;
    VoucherFinancialMonth: any;
    VoucherFinancialYear: any;
    Loading: boolean;
    Loaded: boolean;
}

const initialState:IVoucherReducerState = {
    VoucherType: null,
    VoucherFinancialMonth: null,
    VoucherFinancialYear: null,
    VoucherList: [],
    Loading: false,
    Loaded: false,
}

export function VoucherReducer(state = initialState, action: Action): IVoucherReducerState {
    switch (action.type) {
      case VOUCHER_STATE:{
        const newState = action.payload;
        return { ...state, ...newState } as IVoucherReducerState;
      }
      case VOUCHER_FINANCIAL_MONTH:{
        const VoucherFinancialMonth = action.payload;
        return { ...state, ...{VoucherFinancialMonth} } as IVoucherReducerState;
      }
      case VOUCHER_FINANCIAL_YEAR:{
        const VoucherFinancialYear = action.payload;
        return { ...state, ...{VoucherFinancialYear} } as IVoucherReducerState;
      }
      case VOUCHER_LIST_LOADING:{
        return { ...state, Loading: true } as IVoucherReducerState;
      }
      case VOUCHER_LIST_SUCCESS:{
        const vouchers = action.payload;
        return { ...state, VoucherList: vouchers, Loading:false, Loaded: true } as IVoucherReducerState;
      }
      case VOUCHER_TYPE: {
        const voucherTypeId = action.payload;
        return { ...state, VoucherType: voucherTypeId} as IVoucherReducerState;
      }
      default:{
        return { ...state } as IVoucherReducerState;
      }
    }
  }

  export const getVoucherState = (state: IVoucherReducerState) => state;
  export const getVoucherList = (state: IVoucherReducerState) => state.VoucherList;
  export const getVoucherType = (state: IVoucherReducerState) => state.VoucherType;
  export const getVoucherFinancialMonth = (state: IVoucherReducerState) => state.VoucherFinancialMonth;
  export const getVoucherFinancialYear = (state: IVoucherReducerState) => state.VoucherFinancialYear;
  export const getVoucherLoading = (state: IVoucherReducerState) => state.Loading;
  export const getVoucherLoaded = (state: IVoucherReducerState) => state.Loaded;
  