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

        var selector = d3.select("#selDataset");

        var sampleNames = data.names;

        sampleNames.forEach((sample) =>  {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
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

buildMetaData(940);
buildBarChart(940);
buildBubbleChart (940);