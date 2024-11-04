import { Component, input, Input, OnInit } from "@angular/core";
import { Task } from "../../../shared/task.model";

import { CommonModule } from "@angular/common";
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { Address } from "../../../shared/address.model";

@Component({
  selector:"app-detailed-block",
  templateUrl:"./detailedBlock.html",
  standalone:true,
  imports:[CommonModule,LoaderComponent]
})

export class DetailedBlock {
 
  task=input<Task>();
  address=input<Address>();
  isLoading=false;
  @Input() set t (t:boolean){
    this.isLoading=t;
    
  }

}