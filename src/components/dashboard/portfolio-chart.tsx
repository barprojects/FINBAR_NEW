'use client'

import { useEffect, useRef, useCallback } from 'react'
import { createChart, IChartApi, ISeriesApi, AreaData, Time, AreaSeries } from 'lightweight-charts'
import { ChartDataPoint, formatILS } from '@/lib/demo-data'

interface PortfolioChartProps {
  data: ChartDataPoint[]
  height?: number
}

export function PortfolioChart({ data, height = 400 }: PortfolioChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null)

  const initChart = useCallback(() => {
    if (!chartContainerRef.current) return

    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
      seriesRef.current = null
    }

    const container = chartContainerRef.current

    const chart = createChart(container, {
      width: container.clientWidth,
      height: height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#64748b',
        fontFamily: 'inherit',
      },
      grid: {
        vertLines: { color: '#e2e8f0' },
        horzLines: { color: '#e2e8f0' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#94a3b8',
          width: 1,
          style: 2,
          labelBackgroundColor: '#F7931A',
        },
        horzLine: {
          color: '#94a3b8',
          width: 1,
          style: 2,
          labelBackgroundColor: '#F7931A',
        },
      },
      rightPriceScale: {
        borderColor: '#e2e8f0',
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: '#e2e8f0',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { mouseWheel: true, pinch: true },
    })

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#F7931A',
      topColor: 'rgba(247, 147, 26, 0.4)',
      bottomColor: 'rgba(247, 147, 26, 0.0)',
      lineWidth: 2,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => formatILS(price),
      },
    })

    const chartData: AreaData<Time>[] = data.map((point) => ({
      time: point.time as Time,
      value: point.value,
    }))

    areaSeries.setData(chartData)
    chart.timeScale().fitContent()

    chartRef.current = chart
    seriesRef.current = areaSeries

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
        seriesRef.current = null
      }
    }
  }, [data, height])

  useEffect(() => {
    const cleanup = initChart()
    return cleanup
  }, [initChart])

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      const chartData: AreaData<Time>[] = data.map((point) => ({
        time: point.time as Time,
        value: point.value,
      }))
      seriesRef.current.setData(chartData)
      chartRef.current?.timeScale().fitContent()
    }
  }, [data])

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full rounded-lg overflow-hidden"
      style={{ height: `${height}px` }}
    />
  )
}
