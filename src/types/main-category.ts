export interface MainCategory {
  id: number;
  nameEN: string;
  nameAR: string;
  noteEN: string;
  noteAR: string;
  arrange: number;
  createdAtDate: string;
  createdAtTime: string;
  modifiedAtDate: string | null;
  modifiedAtTime: string | null;
}

export interface MainCategoryResponse {
  result: {
    code: number;
    message: string;
  };
  data: MainCategory[];
} 