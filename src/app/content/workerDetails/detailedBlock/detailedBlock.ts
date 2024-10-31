import { Component, input, Input } from "@angular/core";
import { Task } from "../../../shared/task.model";
@Component({
  selector:"app-detailed-block",
  templateUrl:"./detailedBlock.html",
  standalone:true
})

export class DetailedBlock{
  task=input.required<Task>()
  // @Input({required:true}) set t (t:Task){
  //   this.task=t;
  //   console.log("this.task: ",this.task);
  // }
}