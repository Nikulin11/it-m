import React, { useEffect, useState } from 'react';
import './chart.css';
import {  } from '../Charts';
import { ISensorData, updateSensor } from '../../../store/sensorsStore';
import { getDate } from '../../../utils/react/getDate';
import { LineChart } from './LineChart';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface IChartProps {
  sensor: ISensorData;
  index: number;
}

export function Chart({sensor, index}: IChartProps) {
  const [periodBlock, setPeriodBlock] = useState(false);
  const corsServerUrl = 'http://localhost:8080/';
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const newArr = Object.entries(sensor);
  newArr.pop();
  const sensorArr = newArr.map(el => {
    return {
      date: el[0],
      data: el[1],
    }
  });

  const areaValueArr: number[][] = sensorArr.map(el => [new Date(el.date).getTime(), +el.data.value_max , +el.data.value_min]).sort((a,b) => {return a[0] - b[0]});
  const valueArr: number[][] = sensorArr.map(el => [new Date(el.date).getTime(), +el.data.value]).sort((a,b) => {return a[0] - b[0]});

  function onClickLive() {
    if (sensor.period !== 'Live') {
      const urlRequest = `${corsServerUrl}http://monit.roksperm.ru/api_test/sen_serial=${sensorArr[0].data.sensor_serial}&group_to=hour&date_from=${`${getDate().totalDate}T00:00:00`}&date_to=${getDate().totalDateWithTime}`;
      fetch(urlRequest).then(response => response.json()).then(data => {
        const newSensorObj: ISensorData = {
          ...data,
          period: 'Live',
        }
        updateSensor({data: newSensorObj, index: index});
      });
    }
  }

  function onClickToday() {
    if (sensor.period !== 'сегодня') {
      const urlRequest = `${corsServerUrl}http://monit.roksperm.ru/api_test/sen_serial=${sensorArr[0].data.sensor_serial}&group_to=hour&date_from=${`${getDate().totalDate}T00:00:00`}&date_to=${getDate().totalDateWithTime}`;
      fetch(urlRequest).then(response => response.json()).then(data => {
        const newSensorObj: ISensorData = {
          ...data,
          period: 'сегодня',
        } 
        updateSensor({data: newSensorObj, index: index});
      });
    }
  }

  function addPeriodBlock() {
    if (periodBlock && startDate && endDate) {
      const startDateNormalized = getDate(startDate).totalDateWithTime;
      const endDateNormalized = getDate(endDate).totalDateWithTime;
      const urlRequest = `${corsServerUrl}http://monit.roksperm.ru/api_test/sen_serial=${sensorArr[0].data.sensor_serial}&group_to=hour&date_from=${startDateNormalized}&date_to=${endDateNormalized}`;
      fetch(urlRequest).then(response => response.json()).then(data => {
        const newSensorObj: ISensorData = {
          ...data,
          period: 'период',
        } 
        updateSensor({data: newSensorObj, index: index});
      });
    }
    setPeriodBlock(!periodBlock);
  }

  return (
    <div className='chart__wrapper'>
      <div className='chart__title'>Сенсор температуры - {sensorArr[0].data.sensor_serial}</div>
      <div className='chart__text'>Текущий график - {sensor.period}</div>
      <div className='button-group'>
        <button onClick={onClickLive} className={sensor.period === 'Live' ? 'chart__button active' : 'chart__button'}>Live</button>
        <button onClick={onClickToday} className={sensor.period === 'сегодня' ? 'chart__button active' : 'chart__button'}>Сегодня</button>
        <button onClick={addPeriodBlock} className={sensor.period === 'период' ? 'chart__button active' : 'chart__button'}>За период</button>
      </div>
      {periodBlock && (
        <div className='datepicker-block'>
          <div className='datepicker-block__from'>
            <div className='datepicker-block__from-title'>Выберите начало периода:</div>
            <div>
              <DatePicker
                className={startDate ? 'datepicker-from active' : 'datepicker-from'}
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                }}
                showTimeSelect
                timeIntervals={60}
                timeFormat="HH:mm"
                dateFormat="dd/MM/yyyy, HH:mm"
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText='ДД/ММ/ГГГГ'
              />
            </div>
          </div>
          <div className='datepicker-block__to'>
            <div className='datepicker-block__from-title'>Выберите конец периода:</div>
            <div>
              <DatePicker
                className={endDate ? 'datepicker-to active' : 'datepicker-to'}
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date);
                }}
                timeFormat="HH:mm"
                showTimeSelect
                timeIntervals={60}
                dateFormat="dd/MM/yyyy, HH:mm"
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText='ДД/ММ/ГГГГ'
              />
            </div>
          </div>
        </div>
      )}
      <div className='qqq'>
        <LineChart areaValueArr={areaValueArr} valueArr={valueArr} />
      </div>
    </div>
  );
}
