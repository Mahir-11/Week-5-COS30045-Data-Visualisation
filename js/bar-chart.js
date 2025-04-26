// Bar Chart - Energy Consumption by Screen Technology for 55" TVs

// Set up dimensions and margins
function createBarChart() {
    const container = d3.select('#bar-chart');
    container.html(''); // Clear the container
    
    // Get the dimensions of the container
    const containerWidth = container.node().getBoundingClientRect().width;
    const margin = {top: 40, right: 30, bottom: 60, left: 70};
    const width = containerWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    // Create SVG element
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create tooltip div
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    
    // Load the data
    d3.csv('data/Ex5_TV_energy_55inchtv_byScreenType.csv').then(data => {
        // Convert string values to numbers
        data.forEach(d => {
            d.energy = +d['Mean(Labelled energy consumption (kWh/year))'];
            d.technology = d.Screen_Tech;
        });
        
        // Define X and Y scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.technology))
            .range([0, width])
            .padding(0.3);
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.energy) * 1.1])
            .range([height, 0]);
        
        // Define color scale
        const colorScale = d3.scaleOrdinal()
            .domain(data.map(d => d.technology))
            .range(['#4e79a7', '#f28e2c', '#59a14f']);
        
        // Add X axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('fill', '#000')
            .attr('x', width / 2)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text('Screen Technology');
        
        // Add Y axis
        svg.append('g')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', -50)
            .attr('x', -height / 2)
            .attr('text-anchor', 'middle')
            .text('Average Energy Consumption (kWh/year)');
        
        // Add grid lines
        svg.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat('')
            )
            .style('stroke-dasharray', '3,3')
            .style('stroke-opacity', 0.2);
        
        // Draw bars
        svg.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.technology))
            .attr('width', xScale.bandwidth())
            .attr('y', d => yScale(d.energy))
            .attr('height', d => height - yScale(d.energy))
            .attr('fill', d => colorScale(d.technology))
            .style('opacity', 0.8)
            .on('mouseover', function(event, d) {
                // Highlight bar
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 1);
                
                // Show tooltip
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                
                tooltip.html(`<strong>${d.technology}</strong><br>
                              Avg Energy: ${d.energy.toFixed(1)} kWh/year`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                // Restore bar
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 0.8);
                
                // Hide tooltip
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
        
        // Add value labels on top of bars
        svg.selectAll('.label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => xScale(d.technology) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.energy) - 5)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .text(d => d.energy.toFixed(1));
        
        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text('Average Energy Consumption for 55" TVs by Technology');
    }).catch(error => {
        console.error('Error loading the data:', error);
    });
}

// Initial creation
createBarChart();

// Redraw chart on window resize
window.addEventListener('resize', createBarChart);