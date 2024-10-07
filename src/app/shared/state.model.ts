import { type Worker } from './worker.model';
import { type Task } from './task.model';
export type Content="main"|"task"|"worker"|"tasks";
export interface State {
  workers: Worker[];
  error: string;
  content:Content;
  workerId:string|null;
  tasks:Task[]
}
