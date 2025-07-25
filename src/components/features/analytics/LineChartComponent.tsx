'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import {Card} from "@/components/ui/Card";

interface ChartData {
    date: string;
    [key: string]: any;
}

interface LineChartComponentProps {
    data: ChartData[] | undefined;
    dataKey: string;
}

export function LineChartComponent({ data, dataKey }: LineChartComponentProps) {
    const { t } = useTranslation('common');

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-muted-text py-8 min-h-[150px]">
                {t('noDataAvailable')}
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const formattedDate = format(parseISO(label), t('dateFormatShort'));

            let value = payload[0].value;
            let unit = '';
            let dataLabel = '';

            if (dataKey === 'totalMinutes') {
                const hours = (value / 60).toFixed(1);
                value = hours;
                unit = t('hoursUnit');
                dataLabel = t('totalSleep');
            } else {
                unit = t('countUnit');
                dataLabel = t('count');
            }

            return (
                <Card className="p-2 text-sm shadow-lg">
                    <p className="font-semibold text-dark-text">{formattedDate}</p>
                    <p className="text-primary-blue">{`${dataLabel}: ${value} ${unit}`}</p>
                </Card>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={150}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" vertical={false} />
                <XAxis
                    dataKey="date"
                    tickFormatter={(isoDate) => format(parseISO(isoDate), 'MMM dd')}
                    tick={{ fill: 'var(--color-muted-text)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    padding={{ left: 20, right: 20 }}
                />
                <YAxis
                    tick={{ fill: 'var(--color-muted-text)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke="var(--color-primary-blue)"
                    strokeWidth={2}
                    dot={false}
                    name={dataKey === 'totalMinutes' ? t('totalSleep') : t('count')}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}