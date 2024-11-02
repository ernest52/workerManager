import { Component, input, Input } from "@angular/core";
import { Task } from "../../../shared/task.model";
import { CommonModule } from "@angular/common";
import { LoaderComponent } from "../../../shared/loader/loader.component";
@Component({
  selector:"app-detailed-block",
  templateUrl:"./detailedBlock.html",
  standalone:true,
  imports:[CommonModule,LoaderComponent]
})

export class DetailedBlock{
  task=input.required<Task>();
  isLoading=false;
 
  @Input({required:true}) set t (t:boolean){
    this.isLoading=t;
    
  }
}