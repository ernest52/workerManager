import { Component, DestroyRef, inject, signal } from "@angular/core";
import {  AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkersService } from "../../shared/workers.service";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatFormFieldModule} from '@angular/material/form-field';

import {merge} from 'rxjs';
import { updateErrorMessageFactory } from "../../shared/utilities/updateErrorMessageFactory";
import { type Task } from "../../shared/task.model";


@Component({
  selector:"app-worker-form",
templateUrl:"./worker-form.component.html",
imports: [MatFormFieldModule,ReactiveFormsModule],
standalone:true,


  
})
export class WorkerFormComponent{

filePath!:string;
rangeValues=signal({
  firstName:{min:2,max:15},
  lastName:{min:2,max:15}
});
randomAvatar=true;

message="";
destroyRef=inject(DestroyRef);
_workersRepo=inject(WorkersService);
 error=signal({
  firstName:"",
  lastName:"",
})
workersList=this._workersRepo.workersSignal();
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
    console.log("SENT FORM: ",this.form);
    const {value}=this.form;

    this._workersRepo.createWorker(<string>value.firstName ,<string>value.lastName ,<File>value.image,this.randomAvatar ).subscribe({
      next:(resp)=>{
        console.log(resp),
        
        this.message=resp.message;
        this._workersRepo.addWorkerToManager(resp.worker);
      },
      error:(err)=>{
        console.log(err)
        this._workersRepo.setError(err?.error.message||err?.message || "server response failed")
      }
    })
    this.filePath="";
        this.form.reset();
        this.form.patchValue({image:false});
        this.error.update(()=>({firstName:"",lastName:""}))

  }

}