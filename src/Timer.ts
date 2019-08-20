export enum TimerState {
  STOPPED = "stopped",
  RUNNING = "running",
  PAUSED = "paused"
}
export interface ITimer {
  id?: string;
  title: string;
  body: string;
  icon?: string;
  click_action?: string;
  remaining: number;
  token: string;
  state: TimerState;
}
