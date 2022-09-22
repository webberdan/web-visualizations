const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function initApp() {
    d3.json(url).then((data) => {
        console.log("d3.json >> ", data);
        // load charts from functions below
        initDropdown(data.names);
        loadBarChart(data.names[0]);
        loadBubbleChart(data.names[0]);
        buildMetaData(data.names[0]);
        buildgauge(data.names[0]);
    });


};



initApp();


//Change charts as new test subject is selected
function optionChanged(newSample) {
        buildMetaData(newSample);
        loadBarChart(newSample),
        loadBubbleChart(newSample);
        buildgauge(newSample)
    };


// Create dropdown 
function initDropdown(names) {
    const selector = d3.select("#selDataset");

    // set up dropdown values
    names.forEach((name) => {
        selector.append("option").text(name).property("value", name);
    })
};

function loadBarChart(name) {
    //d3.json using destructuring within the inline function to establish {samples}, 
    //then destructure the  sample object further to extract the required variables
    d3.json(url).then((dataSet) => {
        const { samples } = dataSet;
        // use name to get samples for that name
        const sample = samples.find((sample) => sample.id === name);

        // destructure the necessary variables from sample
        const { otu_ids, otu_labels, sample_values } = sample;

        // create our data array of one object
        const data = [{
            x: sample_values.slice(0, 10).reverse(), 
            y: otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse(),
            type: "bar",
            orientation: "h",
            text: otu_labels.slice(0, 10).reverse(),
        }];

        // create our layout object
        const layout = {
            title: "TODO: DO TITLE",
        };

        Plotly.newPlot("bar", data, layout);
    });
};



function loadBubbleChart(name) {
    // get data from d3.json 
    d3.json(url).then((dataSet) => {
        const { samples } = dataSet;
        // use name to get samples for that name
        const sample = samples.find((sample) => sample.id === name);
        

        // destructure the necessary variables from sample
        const { otu_ids, otu_labels, sample_values } = sample;

        // Define dataset for plotly
        const data1 = [{
            x: otu_ids, 
            y: sample_values,
            text: otu_labels, 
            type: "bubble",
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            },
            text: otu_labels,
        }]   
        // create layout object for plotly
        const layout = {
            title: "Sample Values",
            xaxis: {title : "OTU ID"},
            height: 600,
            width: 1100,
        }
            
        // call plotly to build bubble chart and pass in data and layout objects
        Plotly.newPlot("bubble", data1, layout);
    });
};


// Use metadata from JSON to create "Demographic Info" visualization 
function buildMetaData(sample) {
    d3.json(url).then((data) => {

        // below is the same as const metadata = data.metadata 
        const { metadata } = data;

        // Use Array.Find() on the data for the object with the desired id
        // note: sample is a string and needs to be converted in order to use === below
        const result = metadata.find(sampleObj => sampleObj.id === Number(sample));
        
        // Store reults to correct <div>
        const metadataDiv = d3.select("#sample-metadata");

        // Use `.html("") to clear existing text
        metadataDiv.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        Object.entries(result).forEach(([key, value]) => {
            metadataDiv.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
  });
};
        
// Use metadata from JSON to create "Demographic Info" visualization 
function buildgauge(sample) {
    d3.json(url).then((data) => {
        // data = {
        //     metadata: [...],
        //     samples: [...],
        //     names: [...],
        // }

        // below is the same as const metadata = data.metadata 
        const { metadata } = data;

        // Use Array.Find() on the data for the object with the desired id
        // note: sample is a string and needs to be converted in order to use === below
        const result = metadata.find(sampleObj => sampleObj.id === Number(sample));
    
        var data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: result.wfreq,
              title: { text: "Wash Frequency" },
              type: "indicator",
              mode: "gauge+number",
              delta: { reference: 10 },
              gauge: { 
                axis: { range: [null, 10] },
                steps:[
                { range: [0, 2], color: "red" },
                { range: [2,4], color: "orange" }, 
                { range: [4,6], color: "yellow" },
                { range: [6,8], color: "blue" },
                { range: [8,10], color: "indigo" }
                ]}
            }
          ];
          
          var layout = { width: 600, height: 400 };
          Plotly.newPlot("gauge", data, layout);
        
    })
}



    