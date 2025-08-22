export interface Notice {
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
  
  export interface NoticeResponse {
    result: {
      code: number;
      message: string;
    };
    data: Notice[];
  } 