const mapEmbed = {
  "title": {
    "text": "Population Map of Australian Cities",
    "fontSize": 15,
  },
  "width": 500,
  "height": 300,
  "layer": [
    {
      "data": {
        "url": "data/states.geo.json",
        "format": {"type": "json", "property": "features"}
      },
      "mark": {"type": "geoshape", "fill": "#ddd", "stroke": "black"}, 
    },
    {
      "data": {
        "url": "data/australia_filtered_cities.geo.json",
        "format": {"type": "json", "property": "features"}
      },
      "mark": {
        "type": "circle",
        "color": "blue",
        "tooltip": true
      },
      "encoding": {
        "longitude": {"field": "geometry.coordinates[0]", "type": "quantitative"},
        "latitude": {"field": "geometry.coordinates[1]", "type": "quantitative"},
        "size": {"field": "properties.population", "type": "quantitative", "title": "Population Key"},
        "tooltip": [
          {"field": "properties.name", "type": "nominal", "title": "City"},
          {"field": "properties.population", "type": "quantitative", "title": "Population"}
        ]
      },
    }
  ]
}

const populationGraph = {
  "title": {
    "text": "Overall Population Over Time",
    "fontSize": 15
  },
  "width": 500,
  "height": 300,
  "data": {"url": "data/data_population.csv"},
  "mark": "bar",
  "encoding": {
    "x": {"field": "City", "type": "nominal", "axis": {"title": "City"}},
    "y": {"field": "Population", "type": "quantitative", "axis": {"title": "Population"}},
    "color": {
      "field": "City",
      "type": "nominal", 
      "scale": {
        "scheme": "category10"  // A default color scheme for distinct categories (cities)
      }
    },
    "tooltip": [
      {"field": "City", "type": "nominal"},
      {"field": "Year", "type": "ordinal"},
      {"field": "Population", "type": "quantitative"}
    ]
  },
  "transform": [
    {"filter": "datum.Year == yearSelect"}  // Filter based on selected year
  ],
  "params": [
    {
      "name": "yearSelect",
      "value": 2017,
      "bind": {
        "input": "range",
        "min": 2017,
        "max": 2021,
        "step": 1,
        "name": "Select Year: "
      }
    }
  ]
};

const genderCompare = {
  "title": {
    "text": "Gender Population Over Time",
    "fontSize": 15
  },
  "width": 500,
  "height": 300,
  "data": {"url": "data/gender_population.csv"},
  "mark": "bar",
  "encoding": {
    "x": {"field": "City", "type": "nominal", "axis": {"title": "City"}},
    "y": {"field": "Population", "type": "quantitative", "axis": {"title": "Population"}},
    "color": {
      "field": "Gender",
      "type": "nominal",
      "scale": {
        "domain": ["Female", "Male"],
        "range": ["#FF69B4", "#1f77b4"]
      }
    },
    "xOffset": {"field": "Gender"},
    "tooltip": [
      {"field": "City", "type": "nominal"},
      {"field": "Gender", "type": "nominal"},
      {"field": "Population", "type": "quantitative"}
    ]
  },
  "transform": [
    {"filter": "datum.Year == yearSelect"}  // Filter based on selected year
  ],
  "params": [
    {
      "name": "yearSelect",
      "value": 2017,
      "bind": {
        "input": "range",
        "min": 2017,
        "max": 2021,
        "step": 1,
        "name": "Select Year: "
      }
    }
  ]
};

const ageGraph = {
  "title": {
    "text": "Average Age of Population",
    "fontSize": 15,
  },
  "width": 500,
  "height": 300,
  "data": {"url": "data/median_age.csv"},
  "mark": "line",
  "transform": [
    {
      "filter": {
        "field": "City",
        "oneOf": []  // Used to update the map based on selections
      }
    }
  ],
  "encoding": {
    "x": {"field": "Year", "timeUnit": "year", "axis": {"title": "Year"}},
    "y": {"field": "Age", "type": "quantitative", "scale": {"domain": [33,40]}, "axis": {"title": "Age"}},
    "color": {"field": "City", "type": "nominal"}
  }
};

function updateChart() {
  const selectedCities = [];
  const checkboxes = document.querySelectorAll('#citySelection input[type=checkbox]');
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedCities.push(checkbox.value);
    }
  });
  // Update the filter in Vega-Lite specification
  ageGraph.transform[0].filter.oneOf = selectedCities;
  vegaEmbed('#age-trends', ageGraph).catch(console.error);
}
// Add event listeners to the checkboxes
document.querySelectorAll('#citySelection input[type=checkbox]').forEach((checkbox) => {
  checkbox.addEventListener('change', updateChart);
});
// Initial rendering of the chart with all cities
updateChart();

vegaEmbed('#map', mapEmbed)
vegaEmbed('#population-charts', populationGraph)
vegaEmbed('#gender_pop-chart', genderCompare)
vegaEmbed('#age-trends', ageGraph)