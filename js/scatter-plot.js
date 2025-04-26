// Scatter Plot - TV Energy Consumption vs. Star Rating

// Set up dimensions and margins
function createScatterPlot() {
    const container = d3.select('#scatter-plot');
    container.html(''); // Clear the container
    
    // Get the dimensions of the container
    const containerWidth = container.node().getBoundingClientRect().width;
    const margin = {top: 40, right: 30, bottom: 60, left: 60};
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
    d3.csv('data/Ex5_TV_energy.csv').then(data => {
        // Convert string values to numbers
        data.forEach(d => {
            d.star2 = +d.star2;
            d.energy_consumpt = +d.energy_consumpt;
            d.screensize = +d.screensize;
        });
        
        // Define X and Y scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.star2) * 1.1])
            .range([0, width]);
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.energy_consumpt) * 1.1])
            .range([height, 0]);
        
        // Define color scale based on screen technology
        const uniqueTechs = [...new Set(data.map(d => d.screen_tech))];
        const colorScale = d3.scaleOrdinal()
            .domain(uniqueTechs)
            .range(d3.schemeCategory10);
        
        // Add X axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('fill', '#000')
            .attr('x', width / 2)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text('Star Rating (Energy Efficiency)');
        
        // Add Y axis
        svg.append('g')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', -40)
            .attr('x', -height / 2)
            .attr('text-anchor', 'middle')
            .text('Energy Consumption (kWh/year)');
        
        // Add scatter plot dots
        svg.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.star2))
            .attr('cy', d => yScale(d.energy_consumpt))
            .attr('r', 5)
            .style('fill', d => colorScale(d.screen_tech))
            .style('opacity', 0.7)
            .style('stroke', '#fff')
            .style('stroke-width', 0.5)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 8)
                    .style('opacity', 1);
                
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                
                tooltip.html(`<strong>${d.brand}</strong><br>
                              Screen Tech: ${d.screen_tech}<br>
                              Screen Size: ${d.screensize}"<br>
                              Star Rating: ${d.star2}<br>
                              Energy: ${d.energy_consumpt} kWh/year`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 5)
                    .style('opacity', 0.7);
                
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
        
        // Add legend for screen technologies
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${width - 120}, 10)`);
        
        legend.selectAll('rect')
            .data(uniqueTechs)
            .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', (d, i) => i * 20)
            .attr('width', 12)
            .attr('height', 12)
            .style('fill', d => colorScale(d));
        
        legend.selectAll('text')
            .data(uniqueTechs)
            .enter()
            .append('text')
            .attr('x', 20)
            .attr('y', (d, i) => i * 20 + 10)
            .style('font-size', '10px')
            .text(d => d);
        
        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text('Energy Consumption vs Star Rating by Screen Technology');
    }).catch(error => {
        console.error('Error loading the data:', error);
    });
}

// Initial creation
createScatterPlot();

// Redraw chart on window resize
window.addEventListener('resize', createScatterPlot);