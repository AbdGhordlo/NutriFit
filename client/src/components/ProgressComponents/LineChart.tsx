import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { format } from 'date-fns';

const LineChart = ({ data, color = '#34d399', height = 250 }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;
    
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Set dimensions and margins
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Parse dates and create scales
    const parseDate = d3.timeParse('%Y-%m-%d');
    
    const formattedData = data.map(d => ({
      date: parseDate(d.date),
      value: d.value
    }));
    
    const x = d3.scaleTime()
      .domain(d3.extent(formattedData, d => d.date))
      .range([0, width]);
    
    const y = d3.scaleLinear()
      .domain([
        d3.min(formattedData, d => d.value) * 0.95,
        d3.max(formattedData, d => d.value) * 1.05
      ])
      .range([chartHeight, 0]);
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', chartHeight + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Add gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
      
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0.5);
      
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0);
    
    // Add X and Y axes
    svg.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).tickFormat(d => format(d, 'MMM d')))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em');
    
    svg.append('g')
      .call(d3.axisLeft(y));

    // Add area
    const area = d3.area()
      .x(d => x(d.date))
      .y0(chartHeight)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(formattedData)
      .attr('fill', 'url(#area-gradient)')
      .attr('d', area);
    
    // Add line
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);
    
    const path = svg.append('path')
      .datum(formattedData)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 3)
      .attr('d', line);
    
    // Animate line drawing
    const pathLength = path.node().getTotalLength();
    
    path.attr('stroke-dasharray', pathLength)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(1500)
      .attr('stroke-dashoffset', 0);
    
    // Add dots
    svg.selectAll('.dot')
      .data(formattedData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.value))
      .attr('r', 0)
      .attr('fill', 'white')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .transition()
      .delay((d, i) => i * 150 + 500)
      .duration(300)
      .attr('r', 5);
    
    // Add tooltips using on hover
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('padding', '8px')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', 'white')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);
    
    svg.selectAll('.dot')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(100)
          .attr('r', 7);
        
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html(`${format(d.date, 'MMM d, yyyy')}: <b>${d.value}</b>`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(100)
          .attr('r', 5);
        
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });
    
    // Clean up on unmount
    return () => {
      tooltip.remove();
    };
  }, [data, color, height]);
  
  if (!data || data.length === 0) {
    return <div className="text-center py-6 text-gray-500">No data available</div>;
  }
  
  return (
    <div className="line-chart-container" style={{ height: `${height}px` }}>
      <div ref={chartRef} className="w-full h-full"></div>
    </div>
  );
};

export default LineChart;