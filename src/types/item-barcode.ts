import { Product } from './product';

export interface ItemBarcode {
  barcode: string;
  isItemBox: boolean;
  item: Product;
}

export interface ItemBarcodeForCreateUpdate {
  barcode: string;
  isItemBox: boolean;
  itemId: number;
}


export interface ItemBarcodeResponse {
  result: {
    code: number;
    message: string;
  };
  data: ItemBarcode[];
}
