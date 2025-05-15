import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RadialProgressBar = ({ 
  percentage = 0, 
  color = '#34d399', 
  size = 100, 
  thickness = 8, 
  label,
  duration = 1000
}) => {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear existing elements for redraw
    
    // Calculate dimensions
    const width = size;
    const height = size;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius - thickness;
    
    // Create a group element
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
    
    // Create background arc
    const backgroundArc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(2 * Math.PI);
    
    g.append('path')
      .attr('d', backgroundArc)
      .style('fill', '#e5e7eb');
    
    // Create foreground arc (the progress)
    const foregroundArc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(2 * Math.PI * (percentage / 100));
    
    // Animate the progress arc
    const path = g.append('path')
      .attr('d', foregroundArc)
      .style('fill', 'rgba(0,0,0,0)'); // Start transparent
    
    path.transition()
      .duration(duration)
      .style('fill', color)
      .attrTween('d', () => {
        const interpolator = d3.interpolate(0, percentage / 100);
        return (t) => {
          return d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(radius)
            .startAngle(0)
            .endAngle(2 * Math.PI * interpolator(t))();
        };
      });
    
    // Add label to center if provided
    if (label) {
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('class', 'font-medium')
        .style('font-size', `${radius / 3}px`)
        .style('fill', '#374151')
        .text(label);
    }
  }, [percentage, color, size, thickness, label, duration]);
  
  return (
    <svg 
      ref={svgRef} 
      width={size} 
      height={size} 
      className="overflow-visible"
    />
  );
};

export default RadialProgressBar;