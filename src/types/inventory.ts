  export enum Action {
    Sold = 1,
    Restocked = 2,
    Returned = 3
  }

  export interface InventoryAction {
    id: number;
    stockVal: number;
    itemId: number;
    action: string;
    createdAtDate: string;
    createdAtTime: string;
  }

  export interface MakeInventoryAction {
    itemId: number;
    stockVal: number;
    action: Action;
  }

  export interface BulkInventoryAction {
    stockVal: number;
    action: Action;
  }

  export interface SingleInventoryActionResponse {
    result: {
      code: number;
      message: string;
    };
    data: InventoryAction;
  } 


  export interface InventoryActionResponse {
    result: {
      code: number;
      message: string;
    };
    data: InventoryAction[];
  } 

