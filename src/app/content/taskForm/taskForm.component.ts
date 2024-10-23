import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from "@angular/core";
import {  AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkersService } from "../../shared/workers.service";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatFormFieldModule} from '@angular/material/form-field';

import {  debounceTime,merge, tap} from 'rxjs';
import { updateErrorMessageFactory } from "../../shared/utilities/updateErrorMessageFactory";
import { type Task } from "../../shared/task.model";
import { LoaderComponent } from "../../shared/loader/loader.component";
import { ContentService } from "../../shared/content.service";

import { AsyncPipe } from "@angular/common";



@Component({
  selector:"app-task-form",
templateUrl:"./taskForm.component.html",
imports: [MatFormFieldModule,ReactiveFormsModule,LoaderComponent,AsyncPipe],
standalone:true,
changeDetection:ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent{

isInFuture(control:AbstractControl){
const added=control.get("createdAt");
const finishedTo=control.get("deadline");
if(!added?.value || !finishedTo?.value ) return null;
const addedDate=new Date((added.value as string)).getTime();
const deadline=new Date((finishedTo.value as string)).getTime();
if(deadline<addedDate){

return {deadLineFromPast:true}
}
return null;
}
rangeValues=signal({
  title:{min:5,max:100},
  content:{min:5,max:500}
})

isLoading=signal<boolean>(false);
destroyRef=inject(DestroyRef);
_workersRepo=inject(WorkersService);
_contentRepo=inject(ContentService);
 error=signal({
  title:"",
  terms:"",
  content:"",
  workers:""
})
workersList$=this._workersRepo.state.select("workers");
form=new FormGroup({
title:new FormControl("",{validators:[Validators.required,Validators.minLength(this.rangeValues().title.min),Validators.maxLength(this.rangeValues().title.max)]}),
terms:new FormGroup({
  createdAt:new FormControl(new Date().toISOString().split("T")[0],{validators:[Validators.required]}),
  deadline:new FormControl(new Date(new Date().setDate(new Date().getDate()+1)).toISOString().split("T")[0],{validators:[Validators.required]}),
},{validators:[Validators.required,this.isInFuture]}),
content:new FormControl("",{validators:[Validators.required,Validators.minLength(this.rangeValues().content.min),Validators.maxLength(this.rangeValues().content.max)]}),
workers:new FormControl("",{validators:[Validators.required]})
  });
  title=this.form.get("title") as FormControl<string>;
  content=this.form.get("content") as FormControl<string>;
  terms=this.form.get("terms") as FormGroup;
  workers=this.form.get("workers") as FormControl<string>;
  updateWorkersMessage=updateErrorMessageFactory(this.form,this.error,"workers",[{type:"required",message:"this field is required"}]);
  updateTitleMessage=updateErrorMessageFactory(this.form,this.error,"title",[{type:"required",message:"this field is required"},{type:"minlength",message:`this field must have minimum ${this.rangeValues().title.min} characters`},
    {type:"maxlength",message:`this field must have maximum ${this.rangeValues().title.max} characters`} 
  ]);
  updateContentMessage=updateErrorMessageFactory(this.form,this.error,"content",[{type:"required",message:"this field is required"},{type:"minlength",message:`this field must have minimum ${this.rangeValues().content.min} characters`},
    {type:"maxlength",message:`this field must have maximum ${this.rangeValues().content.max} characters`}]);
  updateTermsMessage=updateErrorMessageFactory(this.form,this.error, "terms",[{type:"required",message:"this field is required"},{type:"deadLineFromPast",message:"Deadline needs to be later or a the same day what task was created"}]);
  constructor() {

    this._workersRepo.createTask$.pipe(takeUntilDestroyed(),tap({
      next:(message)=>{this._contentRepo.setInfo(message);this.isLoading.set(false); },
      error:(err)=>{
        this.isLoading.set(false);
        this._workersRepo.setError(err);
this._workersRepo.onNavigate("error");
      }
    })).pipe(debounceTime(2000),tap({
     next:()=> {
      this._contentRepo.setInfo("");
      this._workersRepo.onNavigate("");
     
     }
    })).subscribe();
    merge(this.title.statusChanges, this.title.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateTitleMessage());
      merge(this.content.statusChanges, this.content.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateContentMessage());
      merge(this.terms.statusChanges, this.terms.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateTermsMessage());
      merge(this.workers.statusChanges, this.workers.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateWorkersMessage());
  }



  handleSubmit(){
    this.isLoading.set(true);
    const {value}=this.form
const newTask:Task={
  id:Date.now(),
  title:value?.title?value.title:"",
  content:value?.content?value.content:"",
  addedAt:value?.terms?.createdAt?value.terms.createdAt:"",
  deadline:value?.terms?.deadline?value.terms.deadline:"",
  worker:value?.workers?value.workers:"",
  addedBy:"admin",
  completed:false,

}


  this._workersRepo.onAddedTask(newTask);
   
    this.form.reset({
      title:"",
      terms: {createdAt:new Date().toISOString().split("T")[0],
      deadline:new Date(new Date().setDate(new Date().getDate()+1)).toISOString().split("T")[0]},
     content:"",
     workers:""
    
        });
        this.error.update(()=>({title:"",terms:"",content:"",workers:""}))
  }

}