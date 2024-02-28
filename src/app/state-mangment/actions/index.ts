import { Action as NgRxAction} from '@ngrx/store';

// in default Action of NgRx there is only type 
// as we need payload we have to extend that interface
export interface Action extends NgRxAction{
    payload?:any
}