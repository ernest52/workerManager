import { Injectable, signal } from "@angular/core";
@Injectable({providedIn:"root"})
export class ContentService{
  private info=signal<string>("");
  private isLoading=signal<boolean>(false);
  setInfo(info:string){
    this.info.set(info);
  }
  setLoading(value:boolean){
    this.isLoading.set(value);
  }
  get infoSignal(){
    return this.info.asReadonly()
  }
  get loadingSignal(){
    return this.isLoading.asReadonly()
  }
}