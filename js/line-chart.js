// Line Chart - Electricity Price Trends

// Set up dimensions and margins
function createLineChart() {
    const container = d3.select('#line-chart');
    container.html(''); // Clear the container
    
    // Get the dimensions of the container
    const containerWidth = container.node().getBoundingClientRect().width;
    const margin = {top: 40, right: 80, bottom: 60, left: 60};
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
    d3.csv('data/Ex5_ARE_Spot_Prices.csv').then(data => {
        // Convert string values to numbers and prepare data
        data.forEach(d => {
            d.Year = +d.Year;
            d.QLD = +d["Queensland ($ per megawatt hour)"];
            d.NSW = +d["New South Wales ($ per megawatt hour)"];
            d.VIC = +d["Victoria ($ per megawatt hour)"];
            d.SA = +d["South Australia ($ per megawatt hour)"];
            d.TAS = +d["Tasmania ($ per megawatt hour)"];
            d.Snowy = +d["Snowy ($ per megawatt hour)"];
            d.Average = +d["Average Price (notTas-Snowy)"];
        });
        
        // Define X and Y scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.Year))
            .range([0, width]);
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(
                d.QLD, d.NSW, d.VIC, d.SA, d.TAS, d.Snowy, d.Average
            )) * 1.1])
            .range([height, 0]);
        
        // Define color scale
        const colorScale = d3.scaleOrdinal()
            .domain(['QLD', 'NSW', 'VIC', 'SA', 'TAS', 'Snowy', 'Average'])
            .range(d3.schemeCategory10);
        
        // Add X axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(10))
            .append('text')
            .attr('fill', '#000')
            .attr('x', width / 2)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text('Year');
        
        // Add Y axis
        svg.append('g')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', -45)
            .attr('x', -height / 2)
            .attr('text-anchor', 'middle')
            .text('Price ($ per megawatt hour)');
        
        // Add grid lines
        svg.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat('')
            )
            .style('stroke-dasharray', '3,3')
            .style('stroke-opacity', 0.2);
        
        // Define line generator
        const line = d3.line()
            .x(d => xScale(d.Year))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);
        
        // Draw line for average only (default)
        // Prepare data for the average line
        const averageData = data.map(d => ({
            Year: d.Year,
            value: d.Average
        }));
        
        // Draw average line
        svg.append('path')
            .datum(averageData)
            .attr('class', 'line')
            .attr('d', line)
            .style('fill', 'none')
            .style('stroke', colorScale('Average'))
            .style('stroke-width', 3)
            .style('opacity', 1);
        
        // Add dots for each data point
        svg.selectAll('.dot')
            .data(averageData)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.Year))
            .attr('cy', d => yScale(d.value))
            .attr('r', 4)
            .style('fill', colorScale('Average'))
            .style('stroke', '#fff')
            .style('stroke-width', 1)
            .style('opacity', 0.8)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 7)
                    .style('opacity', 1);
                
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                
                tooltip.html(`<strong>Year: ${d.Year}</strong><br>
                              Average Price: $${d.value.toFixed(2)}/MWh`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 4)
                    .style('opacity', 0.8);
                
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
        
        // Create checkbox container
        const controls = svg.append('g')
            .attr('class', 'controls')
            .attr('transform', `translate(${width + 5}, 0)`);
        
        // Add title
        controls.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .style('font-size', '10px')
            .style('font-weight', 'bold')
            .text('Show Regions:');
        
        // Add checkboxes and labels
        const regions = ['QLD', 'NSW', 'VIC', 'SA', 'TAS', 'Snowy'];
        const checkboxSize = 10;
        const labelSpacing = 15;
        
        const regionLines = {}; // Store references to region lines
        const regionDots = {}; // Store references to region dots
        
        // Create a function to toggle region lines and dots
        function toggleRegion(region, show) {
            if (show) {
                // Prepare region data
                const regionData = data.map(d => ({
                    Year: d.Year,
                    value: d[region]
                }));
                
                // Draw region line if it doesn't exist
                if (!regionLines[region]) {
                    regionLines[region] = svg.append('path')
                        .datum(regionData)
                        .attr('class', `line line-${region}`)
                        .attr('d', line)
                        .style('fill', 'none')
                        .style('stroke', colorScale(region))
                        .style('stroke-width', 2)
                        .style('opacity', 0)
                        .style('stroke-dasharray', '3,3');
                    
                    // Add dots for each data point
                    regionDots[region] = svg.selectAll(`.dot-${region}`)
                        .data(regionData)
                        .enter()
                        .append('circle')
                        .attr('class', `dot dot-${region}`)
                        .attr('cx', d => xScale(d.Year))
                        .attr('cy', d => yScale(d.value))
                        .attr('r', 3)
                        .style('fill', colorScale(region))
                        .style('stroke', '#fff')
                        .style('stroke-width', 1)
                        .style('opacity', 0)
                        .on('mouseover', function(event, d) {
                            d3.select(this)
                                .transition()
                                .duration(200)
                                .attr('r', 6)
                                .style('opacity', 1);
                            
                            tooltip.transition()
                                .duration(200)
                                .style('opacity', .9);
                            
                            tooltip.html(`<strong>Year: ${d.Year}</strong><br>
                                          ${region} Price: $${d.value.toFixed(2)}/MWh`)
                                .style('left', (event.pageX + 10) + 'px')
                                .style('top', (event.pageY - 28) + 'px');
                        })
                        .on('mouseout', function() {
                            d3.select(this)
                                .transition()
                                .duration(200)
                                .attr('r', 3)
                                .style('opacity', show ? 0.7 : 0);
                            
                            tooltip.transition()
                                .duration(500)
                                .style('opacity', 0);
                        });
                }
                
                // Show the line and dots
                regionLines[region]
                    .transition()
                    .duration(300)
                    .style('opacity', 0.7);
                
                regionDots[region]
                    .transition()
                    .duration(300)
                    .style('opacity', 0.7);
            } else if (regionLines[region]) {
                // Hide the line and dots
                regionLines[region]
                    .transition()
                    .duration(300)
                    .style('opacity', 0);
                
                regionDots[region]
                    .transition()
                    .duration(300)
                    .style('opacity', 0);
            }
        }
        
        regions.forEach((region, i) => {
            // Create checkbox
            const checkbox = controls.append('rect')
                .attr('x', 0)
                .attr('y', 15 + i * labelSpacing)
                .attr('width', checkboxSize)
                .attr('height', checkboxSize)
                .style('fill', 'white')
                .style('stroke', colorScale(region))
                .style('stroke-width', 1)
                .style('cursor', 'pointer')
                .attr('data-state', region)
                .attr('data-checked', 'false')
                .on('click', function() {
                    const checked = d3.select(this).attr('data-checked') === 'true';
                    d3.select(this)
                        .attr('data-checked', !checked)
                        .style('fill', !checked ? colorScale(region) : 'white');
                    toggleRegion(region, !checked);
                });
            
            // Create label
            controls.append('text')
                .attr('x', checkboxSize + 5)
                .attr('y', 15 + i * labelSpacing + checkboxSize - 2)
                .style('font-size', '10px')
                .text(region);
        });
        
        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text('Electricity Price Trends');
        
        // Add annotation for notable price spike
        const maxYearIndex = data.findIndex(d => d.Average === d3.max(data, d => d.Average));
        if (maxYearIndex !== -1) {
            const maxYear = data[maxYearIndex];
            svg.append('line')
                .attr('x1', xScale(maxYear.Year))
                .attr('y1', yScale(maxYear.Average))
                .attr('x2', xScale(maxYear.Year))
                .attr('y2', yScale(maxYear.Average) - 30)
                .style('stroke', '#999')
                .style('stroke-width', 1)
                .style('stroke-dasharray', '3,3');
            
            svg.append('text')
                .attr('x', xScale(maxYear.Year))
                .attr('y', yScale(maxYear.Average) - 35)
                .attr('text-anchor', 'middle')
                .style('font-size', '10px')
                .style('font-weight', 'bold')
                .text(`Peak: $${maxYear.Average.toFixed(1)}/MWh`);
        }
    }).catch(error => {
        console.error('Error loading the data:', error);
    });
}

// Initial creation
createLineChart();

// Redraw chart on window resize
window.addEventListener('resize', createLineChart);