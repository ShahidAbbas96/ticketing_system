export interface Comment {
    id:number;
    text: string;
    userImageUrl?: string; // URL or base64 string for the media
    adeddBy?:string;
    adeddOn?:Date;
  }
  