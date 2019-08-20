import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
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

interface ITms {
  [id: string]: NodeJS.Timer;
}
interface IUnsubs {
  [id: string]: () => void;
}
const tms: ITms = {};
const unsubs: IUnsubs = {};
const app = admin.initializeApp();
const db = admin.firestore();
export const pushMsg = functions.firestore
  .document("timers/{id}")
  .onCreate((snap, context) => {
    const id: string = context.params.id;
    const timer = snap.data() as ITimer | undefined;
    if (timer) {
      const { title, body, icon, click_action } = timer;
      const msg = {
        notification: {
          title,
          body
        },
        token: timer.token,
        webpush: {
          notification: {
            icon,
            click_action
          }
        }
      };
      unsubs[id] = db
        .collection("timers")
        .doc(context.params.id)
        .onSnapshot(doc => {
          if (!doc.exists) {
            const tm = tms[id];
            if (tm) {
              clearTimeout(tm);
              delete tms[id];
            }
            unsubs[id]();
            delete unsubs[id];
          }
        });
      tms[id] = setTimeout(async () => {
        delete tms[id];
        await app.messaging().send(msg);
        await db
          .collection("timers")
          .doc(context.params.id)
          .delete();
      }, timer.remaining * 1000);
    }
    return null;
  });
