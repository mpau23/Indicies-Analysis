IndiciesAnalysis.directive('indiciesChartDirective', ['$parse', '$window', function($parse, $window) {
    return {
        restrict: 'EA',
        template: "<svg class='chart'></svg>",
        link: function(scope, elem, attrs) {

            var data = $parse(attrs.chartData);

            var indiciesDataToPlot = data(scope);

            var d3 = $window.d3;

            var x, y, xAxis, yAxis, tip, line;

            var margin = {
                    top: 20,
                    right: 40,
                    bottom: 30,
                    left: 25
                },
                width = 1040 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom;

            var svg = d3.select(".chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "graph-container");

            function setChartParameters() {

                x = d3.scale.ordinal()
                    .domain(indiciesDataToPlot.map(function(d) {
                        return d.expiry.date;
                    }))
                    .rangeBands([0, width], 0.3, 1);

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                y = d3.scale.linear()
                    .domain(d3.extent(indiciesDataToPlot, function(d) {
                        return d.variance + d.highLowVariance;
                    }))
                    .range([height, 0]);

                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(20, "%")
                    .tickSize(-width, 0, 0);

                y2 = d3.scale.linear()
                    .domain(d3.extent(indiciesDataToPlot, function(d) {
                        if (d.open.volatility) {
                            return d.open.volatility / 100;
                        } else {
                            return 0;
                        }
                    }))
                    .nice()
                    .range([y(0), 0]);

                y2Axis = d3.svg.axis()
                    .scale(y2)
                    .orient("right")
                    .ticks(8, "%")
                    .tickSize(-width, 0, 0);

                line = d3.svg.line()
                    .x(function(d) {
                        return x(d.expiry.date);
                    })
                    .y(function(d) {
                        if (d.open.volatility) {
                            return y2(d.open.volatility / 100);
                        } else {
                            return y2(0);
                        }
                    })
                    .interpolate("linear");

                tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function(d) {
                        return " <div><span class='title'>Variance: </span><span class='value'>" + (d.variance * 100).toFixed(2) + "%</span></div><div><span class='title'>High / Low Variance: </span><span class='value'> " + (d.highLowVariance * 100).toFixed(2) + "%</span></div><div><span class='title'>Open Date: </span><span class='value'> " + d.open.date + " </span></div><div><span class='title'>Open Price: </span><span class='value'> " + d.open.open.toFixed(2) + " </span></div><div><span class='title'>Expiry Date: </span><span class='value'>" + d.expiry.date + " </span></div><div><span class='title'>Expiry Price: </span><span class='value'> " + d.expiry.close.toFixed(2) + " </span></div>";
                    });

                svg.call(tip);
            }

            function drawChart(isRedrawing) {

                setChartParameters();

                if (isRedrawing) {
                    svg.selectAll("g.y").call(yAxis);

                    svg.selectAll("g.y2").call(y2Axis);

                    svg.selectAll("g.x")
                        .attr("transform", "translate(0," + y(0) + ")")
                        .call(xAxis);

                    svg.selectAll(".bar").remove();
                    svg.selectAll(".line").remove();


                } else {
                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + y(0) + ")")
                        .call(xAxis)
                        .selectAll("text");

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis);

                    svg.append("g")
                        .attr("class", "y2 axis")
                        .attr("transform", "translate(" + width + " ,0)")
                        .call(y2Axis);
                }

                svg.selectAll(".graph-container.bar")
                    .data(indiciesDataToPlot)
                    .enter().append("rect")
                    .attr("class", "bar highlow")
                    .attr("data-value", function(d) {
                        return d.highLowVariance;
                    })
                    .attr("x", function(d) {
                        return x(d.expiry.date);
                    })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) {
                        if (d.highLowVariance) {
                            return y(Math.max(0, d.highLowVariance + d.variance));
                        } else {
                            return 0;
                        }
                    })
                    .attr("height", function(d) {
                        if (d.highLowVariance) {
                            return Math.abs(y(d.highLowVariance + d.variance) - y(0));
                        } else {
                            return 0;
                        }
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                svg.selectAll(".graph-container.bar")
                    .data(indiciesDataToPlot)
                    .enter().append("rect")
                    .attr("class", "bar variance")
                    .attr("data-value", function(d) {
                        return d.variance;
                    })
                    .attr("x", function(d) {
                        return x(d.expiry.date);
                    })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) {
                        if (d.variance) {
                            return y(Math.max(0, d.variance));
                        } else {
                            return 0;
                        }
                    })
                    .attr("height", function(d) {
                        if (d.variance) {
                            return Math.abs(y(d.variance) - y(0));
                        } else {
                            return 0;
                        }
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);


                svg.append("path")
                    .attr("class", "line")
                    .attr("d", line(indiciesDataToPlot));

            }

            scope.$watchCollection(data, function(newVal, oldVal) {

                indiciesDataToPlot = newVal;

                var isNew = false;

                if (indiciesDataToPlot) {
                    if (oldVal) {
                        isNew = true;
                    }
                    drawChart(isNew);
                }

            });

        }
    };
}]);
