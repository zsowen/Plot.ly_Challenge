function buildMetaData(sample) {

    d3.json("samples.json").then((data) => {

        console.log(data)

        var metadata = data.metadata

        var sampleArray = metadata.filter(sampleObject => sampleObject.id == sample);

        results = sampleArray[0];
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
buildMetaData(940);