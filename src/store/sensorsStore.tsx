import { createEvent, createStore } from "effector";

interface ISensor {
    sensor_serial: string;
    value: string;
    value_max: string;
    value_min: string;
}

export interface ISensorData {
    sensor: {
        [key: string]: ISensor;
    };
    period: string;
}

export const setStore = createEvent<ISensorData[]>();
export const setPeriod = createEvent<{index: number, period: {text: string, value: [string, string] | []}}>();
export const updateSensor = createEvent<{data: ISensorData, index: number}>();

export const $sensorStore = createStore<ISensorData[]>([])
  .on(setStore, (_state, data) => data)
  /*.on(setPeriod, (state, data) => (
    state.map((el, index) => {
        if (index === data.index) {
            el.period = data.period;
        }
        return el;
    })
  ))*/
  .on(updateSensor, (state, data) => (
    state.map((el, index) => {
        if (index === data.index) {
          el = data.data;
        }
        return el;
    })
  ))

  $sensorStore.watch(el => {
    console.log(el)
  })
  