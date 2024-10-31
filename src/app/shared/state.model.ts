import { type Worker } from './worker.model';
import { type Task } from './task.model';

export interface State {
  workers: Worker[];
  error: string;
workerId:string;
  tasks:Task[]
}
