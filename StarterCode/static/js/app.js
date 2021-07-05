// create function to mete out metadata and build the panel and gauge chart
function buildMetaData(sample) {

    // Grab the data from the JSON file
    d3.json("samples.json").then((data) => {

        // Log the data to check your work
        console.log(data)

        // Identify the metadata part of the dataset and set the variable
        var metadata = data.metadata

        // Filter the metadata specifically by the selected sample
        var sampleArray = metadata.filter(sampleObject => sampleObject.id == sample);
        
        // Specify the specific piece of the array
        var results = sampleArray[0];
        console.log(results);

        // Declare the panel body variable from the HTML code
        var panelBody = d3.select("#sample-metadata");

        // Blank out the panel body in case something was previously there 
        panelBody.html("");

        // Cycle through the sample and build the demographic panel, pull out the key and value for each piece and append it to the HTML code
        Object.entries(results).forEach(([key,value]) => {
            console.log(`key: ${key} value: ${value}`);
            panelBody.append("h5").text(`${key.toUpperCase()}: ${value}`);
        });  
        
        // Parse out the data for the wash frequency gauge
        var wfreq = results.wfreq

        // Build your Data for the Gauge
        var gaugeData = [
            {
              type: "indicator",
              mode: "gauge+number+delta",
              value: wfreq,
              title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
            //   annotations: [{
            //       text: "Scrubs per Week",
            //         font: {
            //             size: 16,
            //         },
            //       showarrow: false,
            //       align
            //   }],
              // Create the gauge itself
              gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                bar: { color: "red" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                  { range: [0,1], color: "#0d0887" },
                  { range: [1,2], color: "#46039f" },
                  { range: [2,3], color: "#7201a8" },
                  { range: [3,4], color: "#9c179e" },
                  { range: [4,5], color: "#bd3786" },
                  { range: [5,6], color: "#d8576b" },
                  { range: [6,7], color: "#ed7953" },
                  { range: [7,8], color: "#fb9f3a" },
                  { range: [8,9], color: "#fdca26" },
                ],

                // Create a marker at the datapoint
                threshold: {
                  line: { color: "blue", width: 4 },
                  thickness: 0.75,
                  value: wfreq
                }
              }
            }
          ];
          
          // Style the chart
          var gaugeLayout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "white",
            font: { color: "darkblue", family: "Arial" }
          };
          
          // Plot the gauge
          Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
}

// Build funciton to build the bar chart
function buildBarChart(sample) {

    // Grab the data from the JSON file
    d3.json("samples.json").then((data) => {

        // Pull out the necessary data
        var samples = data.samples;
        // Check that the data has been parsed correctly
        console.log(samples);

        // Filter data by selected sample
        var sampleArray = samples.filter(sampleObject => sampleObject.id == sample);
        var results = sampleArray[0];
        console.log(results);

        // Pull out the ids, labels, and sample values and give them unique variables
        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;
        var sample_values = results.sample_values;

        // Set y axis to pull the top 10 samples
        var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        console.log(yticks);

        // Specify the plotly data
        var barData = [
            {
                y: yticks,
                x: sample_values.slice(0,10).reverse(),
                text: otu_labels.slice(0,10).reverse(),
                type: "bar",
                orientation: "h",
            }
        ];

        // Specify the plotly layout
        barLayout = {
            title: "Top 10 Bacterial Cultures Found",
            hovermode: "closest",
            xaxis: { title: "OTU Count in Sample"},
            margin: {top: 100, bottom: 100, left: 100, right: 100 },
        };

        // Plot the bar chart
        Plotly.newPlot("bar", barData, barLayout);

    });
}

// Build the bubble chart function
function buildBubbleChart(sample) {

    // Pull the data from the JSON file
    d3.json("samples.json").then((data) => {

        // Pull out necessary data and log it to ensure functional code
        var samples = data.samples;
        console.log(samples);

        // Filter data by the selected sample
        var sampleArray = samples.filter(sampleObject => sampleObject.id == sample);
        var results = sampleArray[0];
        console.log(results);

        // Pull out the ids, labels, and sample values and give them unique variables
        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;
        var sample_values = results.sample_values;

        // Set the bubble chart layout
        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Set the bubble chart data
        var bubbleData = [
            {
                y: sample_values,
                x: otu_ids,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Picnic"
                }
            }
        ];

        // Plot the bubble chart
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    });
};

// Create a function to initialize the page with data in it
function init() {

    // Select the necessary piece of the HTML code
    var selector = d3.select("#selDataset");
    
    //Pull in data from the JSON file
    d3.json("samples.json").then((data) => {
        
        // Specify the bacteria names in the dataset
        var sampleNames = data.names;

        // Cycle through the data and add each bacteria name to the dropdown menu on the webpage
        sampleNames.forEach((sample) =>  {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Grab the first data sample and build the initial charts
        var initialSample = sampleNames[0];
        buildMetaData(initialSample);
        buildBarChart(initialSample);
        buildBubbleChart(initialSample);
    }); 
}

// Create a function for the optionChange JSON in the HTML code
function optionChanged(newSample) {
    buildMetaData(newSample);
    buildBarChart(newSample);
    buildBubbleChart(newSample);
}

// Initialize the webpage
init()