import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import firebase from "firebase/app";
import "firebase/messaging";
import "firebase/firestore";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
const {
  REACT_APP_apiKey: apiKey,
  REACT_APP_VapidKey: VapidKey,
  REACT_APP_authDomain: authDomain,
  REACT_APP_databaseURL: databaseURL,
  REACT_APP_projectId: projectId,
  REACT_APP_storageBucket: storageBucket,
  REACT_APP_messagingSenderId: messagingSenderId,
  REACT_APP_appId: appId
} = process.env;
const firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
const db = firebase.firestore();
export const Timers = db.collection("timers");
export enum TimerState {
  STOPPED = "stopped",
  RUNNING = "running",
  PAUSED = "paused"
}
messaging.usePublicVapidKey(VapidKey || "");
let token: string | null = null;
export const getToken = () => token;
messaging.onTokenRefresh(async () => {
  token = await messaging.getToken();
});
messaging.getToken().then(val => {
  token = val;
});
messaging.onMessage(payload => {
  console.log("onmsg", payload);
});

messaging
  .requestPermission()
  .then(function() {
    console.log("Notification permission granted.");
    // TODO(developer): Retrieve an Instance ID token for use with FCM.
  })
  .catch(function(err) {
    console.log("Unable to get permission to notify.", err);
  });
