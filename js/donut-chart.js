// Donut Chart - Screen Technology Distribution

// Set up dimensions and margins
function createDonutChart() {
    const container = d3.select('#donut-chart');
    container.html(''); // Clear the container
    
    // Get the dimensions of the container
    const containerWidth = container.node().getBoundingClientRect().width;
    const margin = {top: 40, right: 30, bottom: 40, left: 30};
    const width = containerWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    // Calculate radius
    const radius = Math.min(width, height) / 2;
    
    // Create SVG element
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);
    
    // Create tooltip div
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    
    // Load the data
    d3.csv('data/Ex5_TV_energy_Allsizes_byScreenType.csv').then(data => {
        // Convert string values to numbers
        data.forEach(d => {
            d.value = +d['Mean(Labelled energy consumption (kWh/year))'];
            d.technology = d.Screen_Tech;
        });
        
        // Count occurrences of each technology from the main dataset
        d3.csv('data/Ex5_TV_energy.csv').then(mainData => {
            const techCounts = {};
            mainData.forEach(d => {
                if (!techCounts[d.screen_tech]) {
                    techCounts[d.screen_tech] = 0;
                }
                techCounts[d.screen_tech]++;
            });
            
            // Add counts to the data
            data.forEach(d => {
                d.count = techCounts[d.technology] || 0;
            });
            
            // Define color scale
            const colorScale = d3.scaleOrdinal()
                .domain(data.map(d => d.technology))
                .range(['#4e79a7', '#f28e2c', '#59a14f']);
            
            // Define pie layout based on count
            const pie = d3.pie()
                .value(d => d.count)
                .sort(null);
            
            // Define arc
            const arc = d3.arc()
                .innerRadius(radius * 0.5) // This makes it a donut (not a pie)
                .outerRadius(radius * 0.9);
            
            // Define arc for hover effect
            const arcHover = d3.arc()
                .innerRadius(radius * 0.5)
                .outerRadius(radius * 0.95);
            
            // Draw donut chart segments
            const arcs = svg.selectAll('path')
                .data(pie(data))
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', d => colorScale(d.data.technology))
                .attr('stroke', 'white')
                .style('stroke-width', '2px')
                .style('opacity', 0.8)
                .on('mouseover', function(event, d) {
                    // Highlight segment
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('d', arcHover)
                        .style('opacity', 1);
                    
                    // Show tooltip
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', .9);
                    
                    const percent = (d.data.count / d3.sum(data, d => d.count) * 100).toFixed(1);
                    
                    tooltip.html(`<strong>${d.data.technology}</strong><br>
                                  Count: ${d.data.count} TVs<br>
                                  Market Share: ${percent}%<br>
                                  Avg Energy: ${d.data.value.toFixed(1)} kWh/year`)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseout', function() {
                    // Restore segment
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('d', arc)
                        .style('opacity', 0.8);
                    
                    // Hide tooltip
                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                });
            
            // Add labels for large segments
            const arcLabel = d3.arc()
                .innerRadius(radius * 0.7)
                .outerRadius(radius * 0.7);
            
            svg.selectAll('text.label')
                .data(pie(data))
                .enter()
                .append('text')
                .attr('class', 'label')
                .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
                .attr('dy', '0.35em')
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .style('fill', '#fff')
                .text(d => {
                    const percent = (d.data.count / d3.sum(data, d => d.count) * 100).toFixed(0);
                    return percent >= 10 ? `${d.data.technology}` : '';
                });
            
            // Add center text
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .style('font-size', '12px')
                .text('Screen Types');
            
            // Add legend
            const legend = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', `translate(${radius * 1.2}, ${-radius + 20})`);
            
            legend.selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                .attr('x', 0)
                .attr('y', (d, i) => i * 20)
                .attr('width', 12)
                .attr('height', 12)
                .style('fill', d => colorScale(d.technology));
            
            legend.selectAll('text')
                .data(data)
                .enter()
                .append('text')
                .attr('x', 20)
                .attr('y', (d, i) => i * 20 + 10)
                .style('font-size', '10px')
                .text(d => `${d.technology} (${d.count})`);
            
            // Add title
            svg.append('text')
                .attr('x', 0)
                .attr('y', -radius - 10)
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', 'bold')
                .text('TV Screen Technology Distribution');
        });
    }).catch(error => {
        console.error('Error loading the data:', error);
    });
}

// Initial creation
createDonutChart();

// Redraw chart on window resize
window.addEventListener('resize', createDonutChart);