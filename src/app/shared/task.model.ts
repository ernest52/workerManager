export interface Task{
id:string,
title:string,
content:string,
addedAt:string,
deadline:string,
worker:string,
addedBy:string,
error?:string,
completed:boolean
}