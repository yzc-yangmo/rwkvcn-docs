import React, { useEffect } from 'react';
import * as echarts from 'echarts';

export const RadarChartComponent = () => {
    const originalData = {
        labels: [
            'Average',
            'ao3 english',
            'bbc news',
            'wikipedia english',
            'arxiv computer science',
            'arxiv physics',
            'github cpp',
            'github python'
        ],
        datasets: [
            {
                label: 'Mistral-Nemo-Base-2407',
                data: [7.107, 10.070, 8.081, 7.954, 7.419, 7.656, 4.203, 4.368]
            },
            {
                label: 'RWKV-x060-World-14B-v2.1',
                data: [7.609, 10.188, 8.518, 8.343, 7.916, 8.040, 4.930, 5.330]
            },
            {
                label: 'Llama-2-13b-hf',
                data: [7.676, 10.524, 8.279, 8.187, 8.075, 8.311, 4.929, 5.426]
            },
            {
                label: 'Qwen1.5-14B',
                data: [7.697, 10.880, 8.884, 9.102, 7.752, 7.862, 4.665, 4.736]
            }
        ]
    };

    // 归一化数据
    const normalizeData = (data: number[]) => {
        const max = Math.max(...data);
        const min = Math.min(...data);
        return data.map(value => (value - min) / (max - min));
    };

    const normalizedDatasets = originalData.datasets.map(dataset => ({
        ...dataset,
        data: normalizeData(dataset.data)
    }));

    const chartData = originalData.labels.map((label, index) => {
        const dataPoint: { [key: string]: any } = {}; // Define dataPoint with an index signature
        normalizedDatasets.forEach(dataset => {
            dataPoint[dataset.label] = dataset.data[index];
        });
        return dataPoint;
    });

    useEffect(() => {
        const chartDom = document.getElementById('radar-chart');
        const myChart = echarts.init(chartDom);

        const option = {
            tooltip: {},
            legend: {
                data: normalizedDatasets.map(dataset => dataset.label),
                textStyle: {
                    color: '#b6b6b6' // 设置标签文字颜色
                }
            },
            radar: {
                indicator: originalData.labels.map(label => ({ name: label, max: 1 }))
            },
            series: [{
                name: 'Radar Chart',
                type: 'radar',
                data: normalizedDatasets.map(dataset => ({
                    value: dataset.data,
                    name: dataset.label,
                    areaStyle: {
                        opacity: 0.3 // 设置透明度
                    },
                    lineStyle: {
                        width: 1 // 设置边框粗细
                    },
                    symbolSize: 4 // 设置节点大小
                }))
            }]
        };

        myChart.setOption(option);

        return () => {
            myChart.dispose();
        };
    }, [chartData]);

    return (
        <div id="radar-chart" style={{ width: '100%', height: '400px' }}></div>
    );
}