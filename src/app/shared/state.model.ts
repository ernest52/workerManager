import { type Worker } from './worker.model';
export interface State {
  workers: Worker[];
  error: string;
  content:"main"|"task"|"worker";
}
