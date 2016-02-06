var data = [

    {
        date: "01-01-16",
        variance: 0.012,
        highLowVariance: 0.03

    }, {
        date: "02-01-16",
        variance: -0.01,
        highLowVariance: 0.056

    }, {
        date: "03-01-16",
        variance: 0.0193,
        highLowVariance: 0.014
    },
];

var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "%");

var svg = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

console.log(data);

y.domain(d3.extent(data, function(d) {
    return d.variance;
})).nice();

x.domain(data.map(function(d) {
    return d.date;
}));

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) {
        return x(d.date);
    })
    .attr("width", x.rangeBand())
    .attr("y", function(d) {
        return y(Math.max(0, d.variance));
    })
    .attr("height", function(d) {
        return Math.abs(y(d.variance) - y(0));;
    });


function type(d) {
    d.variance = +d.variance;
    return d;
}
