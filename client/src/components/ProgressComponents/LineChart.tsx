import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { format } from "date-fns";

const LineChart = ({ data, color = "#ef4444", height = 250 }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;
    d3.select(chartRef.current).selectAll("*").remove();
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = Math.max(
      0,
      chartRef.current.clientWidth - margin.left - margin.right
    );
    const chartHeight = height - margin.top - margin.bottom;
    // Robust date parsing: handle YYYY-MM-DD and ISO strings
    const parseDate = (d) => {
      const ymd = d3.timeParse("%Y-%m-%d")(d);
      if (ymd) return ymd;
      return d3.isoParse(d);
    };
    // Type the formatted data for D3
    const formattedData: { date: Date; value: number }[] = data
      .map((d: any) => ({ date: parseDate(d.date), value: +d.value }))
      .filter((d) => d.date instanceof Date && !isNaN(d.date as any));
    if (!formattedData.length) return;
    // D3 expects [Date, Date] for extent
    const xDomain = d3.extent(
      formattedData,
      (d: { date: Date; value: number }) => d.date
    ) as [Date, Date];
    const x = d3.scaleTime().domain(xDomain).range([0, width]);
    // Defensive: min/max fallback to 0 if undefined
    const minVal =
      d3.min(formattedData, (d: { date: Date; value: number }) => d.value) ?? 0;
    const maxVal =
      d3.max(formattedData, (d: { date: Date; value: number }) => d.value) ?? 0;
    const y = d3
      .scaleLinear()
      .domain([
        minVal === maxVal
          ? typeof minVal === "number"
            ? minVal - 1
            : 0
          : typeof minVal === "number"
          ? minVal * 0.95
          : 0,
        minVal === maxVal
          ? typeof maxVal === "number"
            ? maxVal + 1
            : 1
          : typeof maxVal === "number"
          ? maxVal * 1.05
          : 1,
      ])
      .range([chartHeight, 0]);
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", chartHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    const gradientId = `area-gradient-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color)
      .attr("stop-opacity", 0.5);
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color)
      .attr("stop-opacity", 0);
    svg
      .append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).tickFormat((d: Date) => format(d, "MMM d")))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em");
    svg.append("g").call(d3.axisLeft(y));
    const area = d3
      .area<{ date: Date; value: number }>()
      .x((d) => x(d.date))
      .y0(chartHeight)
      .y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);
    svg
      .append("path")
      .datum(formattedData)
      .attr("fill", `url(#${gradientId})`)
      .attr("d", area);
    const line = d3
      .line<{ date: Date; value: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);
    const path = svg
      .append("path")
      .datum(formattedData)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 3)
      .attr("d", line);
    const pathLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(1500)
      .attr("stroke-dashoffset", 0);
    svg
      .selectAll(".dot")
      .data(formattedData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.value))
      .attr("r", 0)
      .attr("fill", "white")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .transition()
      .delay((d, i) => i * 150 + 500)
      .duration(300)
      .attr("r", 5);
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("padding", "8px")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);
    svg
      .selectAll(".dot")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(100).attr("r", 7);
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`${format(d.date, "MMM d, yyyy")}: <b>${d.value}</b>`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(100).attr("r", 5);
        tooltip.transition().duration(500).style("opacity", 0);
      });
    return () => {
      tooltip.remove();
    };
  }, [data, color, height]);
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">No data available</div>
    );
  }
  return (
    <div className="line-chart-container" style={{ height: `${height}px` }}>
      <div ref={chartRef} className="w-full h-full"></div>
    </div>
  );
};

export default LineChart;
