import { Action } from '../actions'

export const VOUCHER_STATE = 'voucher state';
export const VOUCHER_LIST_SUCCESS = 'voucher list success';
export const VOUCHER_TYPE = 'voucher type';
export const VOUCHER_FINANCIAL_YEAR = 'voucher financial year';
export const VOUCHER_FINANCIAL_MONTH = 'voucher financial month';
export const VOUCHER_LIST_LOADING = 'voucher loading';
export const VOUCHER_LIST_LOADED = 'voucher loaded';

export class VoucherStateAction implements Action{
    readonly type = VOUCHER_STATE;
    constructor(public payload?:any){}
}

export class VoucherListSuccessAction implements Action{
    readonly type = VOUCHER_LIST_SUCCESS;
    constructor(public payload?:any){}
}

export class VoucherTypeAction implements Action{
    readonly type = VOUCHER_TYPE;
    constructor(public payload?:any){}
}

export class VoucherFinancialYearAction implements Action{
    readonly type = VOUCHER_FINANCIAL_YEAR;
    constructor(public payload?:any){}
}

export class VoucherFinancialMonthAction implements Action{
    readonly type = VOUCHER_FINANCIAL_MONTH;
    constructor(public payload?:any){}
}

export class VoucherListRequestAction implements Action{
    readonly type = VOUCHER_LIST_LOADING;
}

export class VoucherLoadedAction implements Action{
    readonly type = VOUCHER_LIST_LOADED;
}