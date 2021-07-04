function buildMetaData(sample) {

    d3.json("samples.json").then((data) => {

        console.log(data)

        var metadata = data.metadata

        var sampleArray = metadata.filter(sampleObject => sampleObject.id == sample);

        var results = sampleArray[0];
        console.log(results);

        var panelBody = d3.select("#sample-metadata");

        panelBody.html("");

        Object.entries(results).forEach(([key,value]) => {
            console.log(`key: ${key} value: ${value}`);
            panelBody.append("h5").text(`${key.toUpperCase()}: ${value}`);
        });  
        
        var wfreq = results.wfreq

        var gaugeData = [
            {
              type: "indicator",
              mode: "gauge+number+delta",
              value: wfreq,
              title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
              annotations: [{
                  text: "Scrubs per Week",
                    font: {
                        size: 16,
                    },
              }],
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
                threshold: {
                  line: { color: "blue", width: 4 },
                  thickness: 0.75,
                  value: wfreq
                }
              }
            }
          ];
          
          var gaugeLayout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "white",
            font: { color: "darkblue", family: "Arial" }
          };
          
          Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
}

function buildBarChart(sample) {

    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        console.log(samples);

        var sampleArray = samples.filter(sampleObject => sampleObject.id == sample);

        var results = sampleArray[0];
        console.log(results);

        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;
        var sample_values = results.sample_values;


        var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        console.log(yticks);

        var barData = [
            {
                y: yticks,
                x: sample_values.slice(0,10).reverse(),
                text: otu_labels.slice(0,10).reverse(),
                type: "bar",
                orientation: "h",
            }
        ];

        barLayout = {
            title: "Top 10 Bacterial Cultures Found",
            hovermode: "closest",
            xaxis: { title: "OTU Count in Sample"},
            margin: {top: 100, bottom: 100, left: 100, right: 100 },
        };

        Plotly.newPlot("bar", barData, barLayout);

    });
}

function buildBubbleChart(sample) {

    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        console.log(samples);

        var sampleArray = samples.filter(sampleObject => sampleObject.id == sample);

        var results = sampleArray[0];
        console.log(results);

        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;
        var sample_values = results.sample_values;

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

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

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    });
};

function init() {
    var selector = d3.select("#selDataset");
    
    d3.json("samples.json").then((data) => {
        
        var sampleNames = data.names;

        sampleNames.forEach((sample) =>  {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        var initialSample = sampleNames[0];
        buildMetaData(initialSample);
        buildBarChart(initialSample);
        buildBubbleChart(initialSample);
    }); 
}

function optionChanged(newSample) {
    buildMetaData(newSample);
    buildBarChart(newSample);
    buildBubbleChart(newSample);
}

init()