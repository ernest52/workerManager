import { WritableSignal } from "@angular/core";
import { FormGroup } from "@angular/forms";

export function  updateErrorMessageFactory(form:FormGroup,errorSignal:WritableSignal<{}>,controlerName:string,errors:{type:string,message:string}[]){
  return ()=>{
    const controler=form.get(`${controlerName}`);
    if(controler)
      for(let error of errors ){
        if (controler.hasError(error.type)) {
          errorSignal.update((old)=>({...old,[controlerName]:error.message}));
        }
      }
    else{
      return;
    }
  
  
  
  }
}