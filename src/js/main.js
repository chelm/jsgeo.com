'use strict';
let message = "Hey JS.Geo people";
console.log(message);

var width = window.innerWidth,
    height = 425;

var tiler = d3.geo.tile()
    .size([width, height]);

var projection = d3.geo.mercator()
    .center([-75.1667, 39.9500])
    .scale((1 << 21) / 2 / Math.PI)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#banner").append("svg")
    .attr("id", "philly-map")
    .attr("width", width)
    .attr("height", height);

svg.selectAll("g")
  .data(tiler
    .scale(projection.scale() * 2 * Math.PI)
    .translate(projection([0, 0])))
  .enter().append("g")
    .each(function(d) {
      var g = d3.select(this);
      var host = ["a", "b", "c"][(d[0] * 31 + d[1]) % 3];
      var url = ["http://", host, ".tile.openstreetmap.us/vectiles-highroad/", d[2], "/", d[0], "/", d[1],".json"].join('');
      d3.json(url, function(error, json) {
        g.selectAll("path")
            .data(json.features.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; }))
          .enter().append("path")
            .attr("class", function(d) { return d.properties.kind; })
            .attr("d", path);
        });
    });

//39.956184, -75.191801 sceince center
//39.955705, -75.182148 amtrak 
