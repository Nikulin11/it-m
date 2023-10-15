import React, { useState } from 'react';
import './periodpopup.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { $popup, setPopup } from '../../store/popupStore';
import ReactDOM from 'react-dom';
import { useStore } from 'effector-react';
import { CloseIcon } from '../Icons/CloseIcon';
import { ISensorData, setPeriod, updateSensor } from '../../store/sensorsStore';
import { getDate } from '../../utils/react/getDate';

export function PeriodPopup() {
  const corsServerUrl = 'http://localhost:8080/';
  const popup = useStore($popup);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const node = document.querySelector('#popup_root');
  if (!node) return null;

  function handleClose() {
    setPopup({
      open: false,
      indexElem: 0,
      sensorName: '',
    });
  }

  function handleApply() {
    if (startDate && endDate) {
      const startDateNormalized = getDate(startDate).totalDateWithTime;
      const endDateNormalized = getDate(endDate).totalDateWithTime;
      const urlRequest = `${corsServerUrl}http://monit.roksperm.ru/api_test/sen_serial=${popup.sensorName}&group_to=hour&date_from=${startDateNormalized}&date_to=${endDateNormalized}`;
      fetch(urlRequest).then(response => response.json()).then(data => {
        const newSensorObj: ISensorData = {
          ...data,
          period: 'период',
        } 
        updateSensor({data: newSensorObj, index: popup.indexElem});
      });
      setPopup({
        open: false,
        indexElem: 0,
        sensorName: '',
      });
    }
  }

  return (
    <div>
      {ReactDOM.createPortal((
        <div className='popup'>
          <div className='popup__body'>
            <div className='popup__content'>
              <div className='popup__title'>Название счетчика: {popup.sensorName}</div>
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
              <div className='popup__button-block'>
                <button onClick={handleApply} className='popup__button popup__apply-button'>Применить</button>
                <button onClick={handleClose} className='popup__button popup__cancel-button'>Отмена</button>
              </div>
              <button onClick={handleClose} className='popup__close-button'>
                <CloseIcon />
              </button>
            </div>
          </div>
        </div>
      ), node)}
    </div>
  )
}
