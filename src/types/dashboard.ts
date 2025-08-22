export interface Summary {
  totalRevenue: number;
  customersCount: number;
  productsCount: number;
  newProductsThisWeek: number;
  salesCount: number;
}


export interface SummaryResponse {
  result: {
    code: number;
    message: string;
  };
  data: Summary;
} 
