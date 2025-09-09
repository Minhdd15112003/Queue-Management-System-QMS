export enum QueueStatus {
  WAITING = 'waiting',
  SERVING = 'serving',
  SKIP = 'skip',
  COMPLETED = 'completed',
}

export interface QueueItem {
  id: number;
  status: QueueStatus;
  time: string;
  counter?: string;
  [key: string]: any; // Cho phép dynamic properties từ Excel
}
