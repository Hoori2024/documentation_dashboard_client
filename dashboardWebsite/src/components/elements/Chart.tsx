import React from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
);

export const options = {
    responsive: false,
    scales: {
        x: {
          grid: {
            display: false,
            },
        },
    },
    plugins: {
        legend: {
            display: false,
        }
    },
};

//const labels = ['23/06', '24/06', '25/06', '26/06', '27/06', '28/06', '29/06'];

/* export const data = {
    labels,
    datasets: [
        {
            label: 'Datura',
            data: [3, 4, 4, 3, 2, 1, 0],
            backgroundColor: 'rgba(118, 151, 118, 0.9)',
        },
    ],
}; */


/**
 * Graphique à barre.
 * @function Chart
 * @category Composant / elements
 * @param props.data {object[]} données du graphique
 * @param props.data[i].nbSprouts {integer} nombre de pousses
 * @param props.data[i].date {dayjs} date dayjs
 */
export default function Chart(props: any) {
    let daturaCount : number [] = [];
    let dates : string[] = []


    //console.log(props.data);

    for (let i = 0; i < props.data.length; i++) {
        //console.log(props.data[i].nbSprouts);
        //console.log(props.data[i].date.toString());
        daturaCount.push(props.data[i].nbSprouts)
        dates.push(props.data[i].date.format("DD/MM/YYYY").toString())
    }



    let data = {
        labels: dates,
        datasets: [
            {
                label: 'Datura',
                data: daturaCount,
                backgroundColor: 'rgba(118, 151, 118, 0.9)',
            },
        ],
    };

    //console.log(data);

    return (
        <Bar options={options} data={data} />
    );
}
