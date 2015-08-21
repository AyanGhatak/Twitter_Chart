function bubbleChart() {
    var _chart = {};

    var _width = 0.9*screen.width, _height = 0.8*screen.height,
            _margins = {top: 30, left: 30, right: 30, bottom: 30},
            _x, _y, _r, // <-A
            _data = [],
            _colors = d3.scale.category10(),
            _svg,
            _bodyG;

    _chart.render = function () {
        if (!_svg) {
            _svg = d3.select("body").append("svg")
                    .attr("height", _height)
                    .attr("width", _width);

            renderAxes(_svg);

            defineBodyClip(_svg);
        }

        renderBody(_svg);
    };

    function renderAxes(svg) {
        var axesG = svg.append("g")
                .attr("class", "axes");

        var xAxis = d3.svg.axis()
                .scale(_x.range([0, quadrantWidth()]))
                .orient("bottom");

        var yAxis = d3.svg.axis()
                .scale(_y.range([quadrantHeight(), 0]))
                .orient("left");

/*        axesG.append("g")
                .attr("class", "axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yStart() + ")";
                })
                .call(xAxis);
*/
        axesG.append("g")
                .attr("class", "axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yEnd() + ")";
                })
                .call(yAxis);
    }

    function defineBodyClip(svg) {
        var padding = 0;

        svg.append("defs")
                .append("clipPath")
                .attr("id", "body-clip")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", quadrantWidth() + 2 * padding)
                .attr("height", quadrantHeight());
    }

    function renderBody(svg) {
        if (!_bodyG)
            _bodyG = svg.append("g")
                    .attr("class", "body")
                    .attr("transform", "translate(" 
                            + xStart() 
                            + "," 
                            + yEnd() + ")")
                    .attr("clip-path", "url(#body-clip)");

        renderBubbles();
    }

    function renderBubbles() {
        _r.range([0, 50]); // <-B
    
        _data.forEach(function (list, i) {
            _bodyG.selectAll("circle._" + i)
                    .data(list)
                    .enter()
                    .append("circle") // <-C
                    .attr("class", "bubble _" + i);

            _bodyG.selectAll("circle._" + i)
                        .data(list)
                    .style("stroke", function (d, j) { 
                        return _colors(j); 
                    })
                    .style("fill", function (d, j) { 
                        return _colors(j); 
                    })
                    .transition()
                    .attr("cx", function (d) { 
                        return _x(d.x); // <-D
                    })
                    .attr("cy", function (d) { 
                        return _y(d.y); // <-E
                    })
                    .attr("r", function (d) { 
                        return _r(d.r); // <-F
                    });
        });
    }

    function xStart() {
        return _margins.left;
    }

    function yStart() {
        return _height - _margins.bottom;
    }

    function xEnd() {
        return _width - _margins.right;
    }

    function yEnd() {
        return _margins.top;
    }

    function quadrantWidth() {
        return _width - _margins.left - _margins.right;
    }

    function quadrantHeight() {
        return _height - _margins.top - _margins.bottom;
    }

    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };

    _chart.height = function (h) {
        if (!arguments.length) return _height;
        _height = h;
        return _chart;
    };

    _chart.margins = function (m) {
        if (!arguments.length) return _margins;
        _margins = m;
        return _chart;
    };

    _chart.colors = function (c) {
        if (!arguments.length) return _colors;
        _colors = c;
        return _chart;
    };

    _chart.x = function (x) {
        if (!arguments.length) return _x;
        _x = x;
        return _chart;
    };

    _chart.y = function (y) {
        if (!arguments.length) return _y;
        _y = y;
        return _chart;
    };
    
    _chart.r = function (r) {
        if (!arguments.length) return _r;
        _r = r;
        return _chart;
    };

    _chart.addSeries = function (series) {
        _data.push(series);
        return _chart;
    };

    return _chart;
}

function drawigngData() {
    var tweet_map = new Tweet_map();
    drawigngData.tweet_count += 1;
    return {
        x : drawigngData.tweet_count,
        y : tweet_map.getter().drawingInfo(drawigngData.tweet_count).yCoordinate,
        r : tweet_map.getter().drawingInfo(drawigngData.tweet_count).radius
    }    
}
drawigngData.tweet_count = -1;

function update() {
    debugger;
    info = drawigngData();
    console.dir(data);
    data[0].shift();
    console.dir(data[0]);
    console.log(data[0].length);
    console.dir(info);
    data[0].push({x: info.x , y: info.y, r: info.r});
    console.log(data[0].length);
    data.forEach(function (series) {
        chart.addSeries(series);
    });
    chart.render();
}
var numberOfSeries = 1,
    numberOfDataPoint = 50,
    data = [];

for (var i = 0; i < numberOfSeries; ++i)
    data.push(d3.range(numberOfDataPoint).map(function (i) {
        var info = drawigngData();
        return {x: info.x , y: info.y, r: info.r};
    }));
var x_start_index = 0;
var chart = bubbleChart()
        .x(d3.scale.linear().domain([x_start_index, (x_start_index+numberOfDataPoint)]))
        .y(d3.scale.linear().domain([-30, 30]))
        .r(d3.scale.pow().exponent(2).domain([0, 10]));

data.forEach(function (series) {
    chart.addSeries(series);
});
chart.render();