IndiciesAnalysis.directive('indiciesChartDirective', ['$parse', '$window', function($parse, $window) {
    return {
        restrict: 'EA',
        template: "<svg class='chart'></svg>",
        link: function(scope, elem, attrs) {

            var data = $parse(attrs.chartData);

            var indiciesDataToPlot = data(scope);

            var d3 = $window.d3;

            var x, y, xAxis, yAxis, tip;

            var margin = {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 40
                },
                width = 1280 - margin.left - margin.right,
                height = 620 - margin.top - margin.bottom;

            var svg = d3.select(".chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            function setChartParameters() {

                x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1);

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                x.domain(indiciesDataToPlot.map(function(d) {
                    return d.expiry.date;
                }));

                y = d3.scale.linear()
                    .range([height, 0]);

                y.domain(d3.extent(indiciesDataToPlot, function(d) {
                    return d.variance;
                })).nice();

                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(20, "%")
                    .tickSize(-width, 0, 0);

                tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function(d) {
                        return "
                            <div>
                                <strong>Variance:</strong> 
                                <span style='color:red'>" + (d.variance*100).toFixed(2) + "%</span>
                            </div>
                            <div>
                                <strong>High/Low Variance:</strong> 
                                <span style='color:red'>" + (d.highLowVariance*100).toFixed(2) + "%</span>
                            </div>
                            <div>
                                <strong>Open Date</strong>
                                <span style='color:red'>" + d.open.date + "</span>
                            </div>
                            <div>
                                <strong>Expiry Date</strong>
                                <span style='color:red'>" + d.expiry.date + "</span>
                            </div>";
                    });

                svg.call(tip);

            }

            function drawChart() {

                setChartParameters();

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + y(0) + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("display", "none");

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

                svg.selectAll("g.bar")
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
                    .on('mouseout', tip.hide);;

                svg.selectAll("g.bar")
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
            }

            function redrawChart(oldData) {

                setChartParameters();

                svg.selectAll("g.y").call(yAxis);

                svg.selectAll("g.x")
                    .attr("transform", "translate(0," + y(0) + ")")
                    .call(xAxis);

                svg.selectAll(".bar").remove();

                svg.selectAll("g.bar")
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

                svg.selectAll("g.bar")
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

            }

            scope.$watchCollection(data, function(newVal, oldVal) {

                indiciesDataToPlot = newVal;

                if (indiciesDataToPlot) {
                    if (oldVal) {
                        redrawChart(oldVal);
                    } else {
                        drawChart();
                    }
                }
            });

        }
    };
}]);
