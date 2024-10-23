import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from "@angular/core";
import {  FormControl, FormGroup, Validators } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkersService } from "../../shared/workers.service";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatFormFieldModule} from '@angular/material/form-field';

import { delay, merge, tap} from 'rxjs';
import { updateErrorMessageFactory } from "../../shared/utilities/updateErrorMessageFactory";
import { LoaderComponent } from "../../shared/loader/loader.component";
import { ContentService } from "../../shared/content.service";


@Component({
  selector:"app-worker-form",
templateUrl:"./worker-form.component.html",
imports: [MatFormFieldModule,ReactiveFormsModule,LoaderComponent],
standalone:true,
changeDetection:ChangeDetectionStrategy.OnPush


  
})
export class WorkerFormComponent{

filePath!:string;
rangeValues=signal({
  firstName:{min:2,max:15},
  lastName:{min:2,max:15}
});

randomAvatar=true;
isLoading=signal<boolean>(false);
avatar="preview";
destroyRef=inject(DestroyRef);
_workersRepo=inject(WorkersService);
_contentRepo=inject(ContentService);
 error=signal({
  firstName:"",
  lastName:"",
})


form=new FormGroup({
firstName:new FormControl("",{validators:[Validators.required,Validators.minLength(this.rangeValues().firstName.min),Validators.maxLength(this.rangeValues().firstName.max)]}),
lastName:new FormControl("",{validators:[Validators.required,Validators.minLength(this.rangeValues().lastName.min),Validators.maxLength(this.rangeValues().lastName.max)]}),
image:new FormControl({}),

  });
  firstName=this.form.get("firstName") as FormControl<string>;
  lastName=this.form.get("lastName") as FormControl<string>;
  
  updateFirstNameMessage=updateErrorMessageFactory(this.form,this.error,"firstName",[{type:"required",message:"this field is required"},{type:"minlength",message:`this field must have minimum ${this.rangeValues().firstName.min} characters`},
    {type:"maxlength",message:`this field must have maximum ${this.rangeValues().firstName.max} characters`} 
  ]);
  updateLastNameMessage=updateErrorMessageFactory(this.form,this.error,"lastName",[{type:"required",message:"this field is required"},{type:"minlength",message:`this field must have minimum ${this.rangeValues().lastName.min} characters`},
    {type:"maxlength",message:`this field must have maximum ${this.rangeValues().lastName.max} characters`} 
  ]);
  constructor() {
  merge(this.firstName.valueChanges,this.firstName.statusChanges).pipe(takeUntilDestroyed()).subscribe(()=>this.updateFirstNameMessage());
     merge(this.lastName.valueChanges,this.lastName.statusChanges).pipe(takeUntilDestroyed()).subscribe(()=>this.updateLastNameMessage());
 }
 onInsertImage(event:Event){
  const button=event.target as HTMLInputElement;
  
  if(button!==null && button.files!==null){
const file=button.files[0];
this.form.patchValue({image:file});
this.form.get("image")?.updateValueAndValidity();
this.randomAvatar=false;
const reader=new FileReader();
reader.onload=()=>{
  this.filePath=reader.result as string;
}
reader.readAsDataURL(file);
  }
 }



  handleSubmit(){
this.isLoading.set(true);
    const {value}=this.form;
   const sub= this._workersRepo.createWorker(<string>value.firstName ,<string>value.lastName ,<File>value.image,this.randomAvatar ).pipe(tap({
      next:(resp)=>{
       this.avatar="selected"
       this.isLoading.set(false);
        this._contentRepo.setInfo(resp.message);
        this.filePath="";
        this.form.reset();
        this.form.patchValue({image:resp.worker.avatar?.url || resp.worker?.image})
        this.filePath=resp.worker.avatar?.url || resp.worker?.image || "";
        this.error.update(()=>({firstName:"",lastName:""}))
        
      },
      error:(err)=>{
 
        this._workersRepo.setError(err?.error.message||err?.message || "server response failed");
        this._workersRepo.onNavigate("error")
      },
    }),delay(1500),tap({
      next:()=>{this._contentRepo.setInfo("");}
    })).subscribe()
    this.destroyRef.onDestroy(()=>sub.unsubscribe());
  

  }

}