import React, { useEffect, useState } from 'react';
import './charts.css';
import { getDate } from '../../utils/react/getDate';
import { Chart } from './Chart/Chart';
import { generateRandomString } from '../../utils/react/generateRandomIndex';
import { useStore } from 'effector-react';
import { $sensorStore, ISensorData, setStore } from '../../store/sensorsStore';
import { $popup } from '../../store/popupStore';
import { PeriodPopup } from '../PeriodPopup';
import { LineChart } from './Chart/LineChart';

export function Charts() {
  const [mounted, isMounted] = useState(false);
  const sensorStore = useStore($sensorStore);
  const popup = useStore($popup);
  const corsServerUrl = 'http://localhost:8080/';
  const todayDate = getDate().totalDateWithTime; // Текущая дата в формате YYYY-MM-DD

  // Массив используемых сенсоров
  const sensorArr = [
                      'sisolskaya_9a_t1_1', 'sisolskaya_9a_t1_2', 'sisolskaya_9a_t1_3', 'sisolskaya_9a_t2_1',
                      'sisolskaya_9a_t2_2', 'sisolskaya_9a_t2_3', 'sisolskaya_9a_t3_1', 'sisolskaya_9a_p1_1',
                      'sisolskaya_9a_p1_2', 'sisolskaya_9a_p1_3', 'sisolskaya_9a_p2_1', 'sisolskaya_9a_p2_2',
                      'sisolskaya_9a_p2_3', 'sisolskaya_9a_p3_1', 'sisolskaya_9a_p4_1',
                    ];

  // Формируем URL запроса для каждого сенсора из массива (стартовое состояние - часовые показания сенсоров на текущую дату)
  const arr = sensorArr.map((el) => {
    return `${corsServerUrl}https://monit.roksperm.ru/api_test/sen_serial=${el}&group_to=hour&date_from=${getDate().totalDate}&date_to=${getDate().totalDateWithTime}`;
  });

  // Запрашиваем данные с сервера по всем сенсорам и записываем их в стейт
  useEffect(() => {
    isMounted(true);
  }, []);

  useEffect(() => {
    if(mounted) {
      const promises = arr.map(el => fetch(el).then(res => res.json()));
      Promise.all<ISensorData>(promises).then(results => {
        results.forEach(el => {
          el.period = 'сегодня';
        })
        setStore(results);
      });
    }
  }, [mounted])
  

  return (
    <div className='charts'>
      {sensorStore.length !== 0 && sensorStore.map((el, index) => {
        return (
          <Chart key={generateRandomString()} sensor={el} index={index}/>
        )
      })}
      {popup.open && <PeriodPopup />}
    </div>
  );
}
