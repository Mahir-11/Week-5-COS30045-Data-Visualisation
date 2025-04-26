# D3.js Multi-Chart Dashboard

This project is a dashboard displaying multiple chart types using D3.js to visualize TV energy consumption data. It demonstrates the use of different D3 visualization techniques in a responsive, interactive dashboard.

## Project Structure

```
project/
├── index.html            # Main HTML file
├── styles.css            # CSS styles for the page
├── README.md             # This file
├── js/                   # JavaScript files for each chart
│   ├── scatter-plot.js   # Scatter plot of energy consumption vs. star rating
│   ├── donut-chart.js    # Donut chart of screen technology distribution
│   ├── bar-chart.js      # Bar chart of energy consumption by screen tech (55" TVs)
│   └── line-chart.js     # Line chart of electricity prices (1998-2024)
└── data/                 # CSV data files
    ├── tv_energy_vs_stars.csv          # Data for scatter plot
    ├── screen_technology.csv           # Data for donut chart
    ├── screen_technology_55inch.csv    # Data for bar chart
    └── electricity_prices.csv          # Data for line chart
```

## Chart Types Implemented

1. **Scatter Plot**: Shows the relationship between energy efficiency ratings (stars) and actual power consumption for different TV models. Points are colored by screen size.

2. **Donut Chart**: Displays the proportion of different screen technologies in the market.

3. **Bar Chart**: Compares the average energy consumption of 55-inch TVs across different screen technologies.

4. **Line Chart**: Shows the historical trend of electricity prices from 1998 to 2024, with the ability to toggle display of individual state prices.

## Features

- **Responsive Design**: All charts resize based on screen/window size
- **Interactive Elements**: Tooltips appear on hover to show detailed information
- **Dynamic Updates**: Charts redraw on window resize
- **Interactive Controls**: Toggle state lines in the line chart
- **Consistent Styling**: Coordinated color schemes across visualizations

## Implementation Details

### Scatter Plot
- Uses d3.scaleLinear for both axes
- Color-coded by screen size
- Includes tooltips with detailed model information

### Donut Chart
- Uses d3.pie and d3.arc to generate the donut segments
- Interactive segments expand on hover
- Center text and labels for large segments

### Bar Chart
- Uses d3.scaleBand for categories and d3.scaleLinear for values
- Includes grid lines for better readability
- Value labels appear on top of each bar

### Line Chart
- Shows average electricity price by default
- Interactive checkboxes to toggle display of individual state lines
- Annotates the peak price point
- Uses d3.line with monotone curve interpolation

## How to Run

1. Make sure all files are in the correct directory structure
2. Serve the project using a local web server:
   - Using Python: `python -m http.server` (Python 3)
   - Using VS Code: Use the Live Server extension
   - Using Node.js: `npx serve`
3. Open the browser to the local server address (typically http://localhost:8000)

## D3.js Techniques Demonstrated

- Data loading and parsing with d3.csv
- Scales (linear, band, ordinal)
- Axes creation and customization
- Data binding and DOM manipulation
- Enter-update-exit pattern
- Event handling (mouseover, mouseout, click)
- Transitions and animations
- SVG path generation
- Responsive design principles

## Browser Compatibility

This dashboard is designed to work with modern browsers that support ES6+ JavaScript features and modern SVG capabilities:
- Chrome 60+
- Firefox 54+
- Safari 10+
- Edge 15+