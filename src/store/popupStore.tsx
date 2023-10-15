import { createEvent, createStore } from "effector";
import { ISensorData } from "./sensorsStore";

interface IPopup {
  open: boolean,
  indexElem: number,
  sensorName: string,
}

export const setPopup = createEvent<IPopup>({});
export const $popup = createStore<IPopup>({
  open: false,
  indexElem: 0,
  sensorName: '',
});
$popup.on(setPopup, (_state, data: IPopup) => data);
  