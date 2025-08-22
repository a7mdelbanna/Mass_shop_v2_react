export interface Tag {
    id: number;
    nameEN: string;
    nameAR: string;
    emoji: string;
    color: string;
    createdAtDate: string;
    createdAtTime: string;
    modifiedAtDate: string | null;
    modifiedAtTime: string | null;
  }
  
  export interface TagResponse {
    result: {
      code: number;
      message: string;
    };
    data: Tag[];
  } 