export interface Worker {
  message?:string;
  id: string;
  firstName: string;
  lastName: string;
  image?: string ;
  avatar?:{
    url:string,
    fileName:string
  }
}
