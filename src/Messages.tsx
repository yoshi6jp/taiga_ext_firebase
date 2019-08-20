import React, { useState, useEffect, useCallback } from "react";
import { Timers } from ".";
import { ITimer } from "./Timer";

interface IStopBtn {
  id?: string;
}
const StopBtn: React.FC<IStopBtn> = ({ id }) => {
  const handleClick = useCallback(() => {
    Timers.doc(id).delete();
  }, [id]);
  return <button onClick={handleClick}>X</button>;
};
export const Messages: React.FC = () => {
  const [items, setItems] = useState<ITimer[]>([]);
  useEffect(
    () =>
      Timers.onSnapshot(docs => {
        const data: ITimer[] = [];
        docs.forEach(doc => {
          const id = doc.id;
          data.push({ ...doc.data(), id } as ITimer);
        });
        setItems(data);
      }),
    []
  );

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <span>{item.title}</span>
          <StopBtn id={item.id} />
        </li>
      ))}
    </ul>
  );
};
