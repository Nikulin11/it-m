import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from 'highcharts/highcharts-more';
import exporting from 'highcharts/modules/exporting.js';
import data from 'highcharts/modules/data';
import exportData from 'highcharts/modules/export-data';
import accessibility from 'highcharts/modules/accessibility';
highchartsMore(Highcharts);
exporting(Highcharts);
exportData(Highcharts);
data(Highcharts);
accessibility(Highcharts);

interface ILineChart {
  areaValueArr: number[][];
  valueArr: number[][];
}

export function LineChart({areaValueArr, valueArr}: ILineChart) {
  Highcharts.setOptions({
    global: {
      useUTC: false
    },
    lang: {
        months: [
            'Январь', 'Февраль', 'Март', 'Апрель',
            'Май', 'Июнь', 'Июль', 'Август',
            'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ],
        shortMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        weekdays: [
            'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
            'Четверг', 'Пятница', 'Суббота'
        ],
        shortWeekdays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        downloadCSV: 'Скачать CSV',
        downloadJPEG: 'Скачать JPEG',
        downloadMIDI: 'Скачать MIDI',
        downloadPDF: 'Скачать PDF',
        downloadPNG: 'Скачать PNG',
        downloadSVG: 'Скачать SVG',
        downloadXLS: 'Скачать XLS',
        exitFullscreen: 'Выйти из полноэкранного режима',
        loading: 'Загрузка',
        noData: 'Нет данных для отображения',
        printChart: 'Распечатать график',
        rangeSelectorZoom: '',
        resetZoom: 'Сбросить масштабирование',
        resetZoomTitle: 'Сбросить ммасштабирование',
        viewData: 'Показать данные в виде таблицы',
        viewFullscreen: 'Полноэкранный режим',
        hideData: 'Скрыть таблицу с данными'
    },
    credits: {
      enabled: false
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ["viewFullscreen", "printChart", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "downloadXLS"],
        }
      },
    },
    rangeSelector: {
      buttons: [{
        type: 'month',
        count: 1,
        text: '1м',
        title: 'Показать 1 месяц'
      }, {
          type: 'month',
          count: 3,
          text: '3м',
          title: 'Показать 3 месяца'
      }, {
          type: 'month',
          count: 6,
          text: '6м',
          title: 'Показать 6 месяцев'
      }, {
          type: 'year',
          count: 1,
          text: '1г',
          title: 'Показать 1 год'
      }, {
          type: 'all',
          text: 'Полностью',
          title: 'Показать весь график'
      }]
    }
  });

  const stockOptions: Highcharts.Options = {
    chart: {
      panKey: 'alt',
      zooming: {
        type: 'x',
      }
  },
    rangeSelector: {
      selected: 0,
      inputEnabled: false,
      buttonTheme: {
        width: 'fit-content',
        paddingRight: 10,
        paddingLeft: 10
      }
  },
  xAxis: {
    type: 'datetime',
    labels: {
      format: '{value: %e-%m-%Y %H:%M}'
    },
  },
  yAxis: {
    opposite: false,
  },
  tooltip: {
    split: false,
    shared: true,  
    valueSuffix: '°C',
},
  series: [{
      type: 'spline',
      name: 'Ср. температура',
      data: valueArr,
      tooltip: {
          valueDecimals: 2
      }
    },
    {
      name: 'Диапазон температур',
      data: areaValueArr,
      type: 'areasplinerange',
      lineWidth: 0,
      linkedTo: ':previous',
      fillOpacity: 0.3,
      zIndex: 0,
      marker: {
          enabled: false
      },
      tooltip: {
        valueDecimals: 2
    }
  }]
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={'stockChart'}
      options={stockOptions}
    />
  );
}
