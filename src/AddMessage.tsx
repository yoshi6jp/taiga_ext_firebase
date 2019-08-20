import React, { useState, useCallback } from "react";
import { Timers, getToken, TimerState } from ".";

export const AddMessage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [duration, setDuration] = useState(60);
  const handleTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    if (val) {
      setTitle(val);
    }
  }, []);
  const handleBody = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    if (val) {
      setBody(val);
    }
  }, []);
  const handleDuration = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.currentTarget.value);
      if (val) {
        setDuration(val);
      }
    },
    []
  );
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const token = getToken();
      console.log("add", token, title);
      if (token && title && duration) {
        Timers.add({
          title,
          body,
          icon: "/tomato.png",
          click_action: window.location.href,
          remaining: duration,
          token,
          state: TimerState.RUNNING
        });
      }
    },
    [body, duration, title]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          title
          <input required onChange={handleTitle} />
        </label>
      </div>
      <div>
        <label>
          body
          <input onChange={handleBody} />
        </label>
      </div>
      <div>
        <label>
          duration
          <input
            required
            onChange={handleDuration}
            type="number"
            defaultValue={"60"}
          />
        </label>
      </div>
      <div>
        <button>SET</button>
      </div>
    </form>
  );
};
