import { Component, input } from "@angular/core";
import { Task } from "../../../shared/task.model";
import { CommonModule } from "@angular/common";
import { Address } from "../../../shared/address.model";

@Component({
  selector:"app-detailed-block",
  templateUrl:"./detailedBlock.html",
  standalone:true,
  imports:[CommonModule]
})

export class DetailedBlock {
 
  task=input<Task>();
  address=input<Address>();
 removingID=input<string>();



}