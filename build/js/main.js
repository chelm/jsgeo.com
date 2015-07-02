(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
let message = "Hey JS.Geo people";
console.log(message);

var width = window.innerWidth,
    height = 400;

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
      console.log(url);
      d3.json(url, function(error, json) {
        g.selectAll("path")
            .data(json.features.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; }))
          .enter().append("path")
            .attr("class", function(d) { return d.properties.kind; })
            .attr("d", path);
        });
    });

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xubGV0IG1lc3NhZ2UgPSBcIkhleSBKUy5HZW8gcGVvcGxlXCI7XG5jb25zb2xlLmxvZyhtZXNzYWdlKTtcblxudmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGgsXG4gICAgaGVpZ2h0ID0gNDAwO1xuXG52YXIgdGlsZXIgPSBkMy5nZW8udGlsZSgpXG4gICAgLnNpemUoW3dpZHRoLCBoZWlnaHRdKTtcblxudmFyIHByb2plY3Rpb24gPSBkMy5nZW8ubWVyY2F0b3IoKVxuICAgIC5jZW50ZXIoWy03NS4xNjY3LCAzOS45NTAwXSlcbiAgICAuc2NhbGUoKDEgPDwgMjEpIC8gMiAvIE1hdGguUEkpXG4gICAgLnRyYW5zbGF0ZShbd2lkdGggLyAyLCBoZWlnaHQgLyAyXSk7XG5cbnZhciBwYXRoID0gZDMuZ2VvLnBhdGgoKVxuICAgIC5wcm9qZWN0aW9uKHByb2plY3Rpb24pO1xuXG52YXIgc3ZnID0gZDMuc2VsZWN0KFwiI2Jhbm5lclwiKS5hcHBlbmQoXCJzdmdcIilcbiAgICAuYXR0cihcImlkXCIsIFwicGhpbGx5LW1hcFwiKVxuICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXG4gICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KTtcblxuc3ZnLnNlbGVjdEFsbChcImdcIilcbiAgLmRhdGEodGlsZXJcbiAgICAuc2NhbGUocHJvamVjdGlvbi5zY2FsZSgpICogMiAqIE1hdGguUEkpXG4gICAgLnRyYW5zbGF0ZShwcm9qZWN0aW9uKFswLCAwXSkpKVxuICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgLmVhY2goZnVuY3Rpb24oZCkge1xuICAgICAgdmFyIGcgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgICB2YXIgaG9zdCA9IFtcImFcIiwgXCJiXCIsIFwiY1wiXVsoZFswXSAqIDMxICsgZFsxXSkgJSAzXTtcbiAgICAgIHZhciB1cmwgPSBbXCJodHRwOi8vXCIsIGhvc3QsIFwiLnRpbGUub3BlbnN0cmVldG1hcC51cy92ZWN0aWxlcy1oaWdocm9hZC9cIiwgZFsyXSwgXCIvXCIsIGRbMF0sIFwiL1wiLCBkWzFdLFwiLmpzb25cIl0uam9pbignJyk7XG4gICAgICBjb25zb2xlLmxvZyh1cmwpO1xuICAgICAgZDMuanNvbih1cmwsIGZ1bmN0aW9uKGVycm9yLCBqc29uKSB7XG4gICAgICAgIGcuc2VsZWN0QWxsKFwicGF0aFwiKVxuICAgICAgICAgICAgLmRhdGEoanNvbi5mZWF0dXJlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEucHJvcGVydGllcy5zb3J0X2tleSAtIGIucHJvcGVydGllcy5zb3J0X2tleTsgfSkpXG4gICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnByb3BlcnRpZXMua2luZDsgfSlcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBwYXRoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4iXX0=
