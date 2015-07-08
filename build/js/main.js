(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcbmxldCBtZXNzYWdlID0gXCJIZXkgSlMuR2VvIHBlb3BsZVwiO1xuY29uc29sZS5sb2cobWVzc2FnZSk7XG5cbnZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgIGhlaWdodCA9IDQyNTtcblxudmFyIHRpbGVyID0gZDMuZ2VvLnRpbGUoKVxuICAgIC5zaXplKFt3aWR0aCwgaGVpZ2h0XSk7XG5cbnZhciBwcm9qZWN0aW9uID0gZDMuZ2VvLm1lcmNhdG9yKClcbiAgICAuY2VudGVyKFstNzUuMTY2NywgMzkuOTUwMF0pXG4gICAgLnNjYWxlKCgxIDw8IDIxKSAvIDIgLyBNYXRoLlBJKVxuICAgIC50cmFuc2xhdGUoW3dpZHRoIC8gMiwgaGVpZ2h0IC8gMl0pO1xuXG52YXIgcGF0aCA9IGQzLmdlby5wYXRoKClcbiAgICAucHJvamVjdGlvbihwcm9qZWN0aW9uKTtcblxudmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNiYW5uZXJcIikuYXBwZW5kKFwic3ZnXCIpXG4gICAgLmF0dHIoXCJpZFwiLCBcInBoaWxseS1tYXBcIilcbiAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxuICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCk7XG5cbnN2Zy5zZWxlY3RBbGwoXCJnXCIpXG4gIC5kYXRhKHRpbGVyXG4gICAgLnNjYWxlKHByb2plY3Rpb24uc2NhbGUoKSAqIDIgKiBNYXRoLlBJKVxuICAgIC50cmFuc2xhdGUocHJvamVjdGlvbihbMCwgMF0pKSlcbiAgLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHtcbiAgICAgIHZhciBnID0gZDMuc2VsZWN0KHRoaXMpO1xuICAgICAgdmFyIGhvc3QgPSBbXCJhXCIsIFwiYlwiLCBcImNcIl1bKGRbMF0gKiAzMSArIGRbMV0pICUgM107XG4gICAgICB2YXIgdXJsID0gW1wiaHR0cDovL1wiLCBob3N0LCBcIi50aWxlLm9wZW5zdHJlZXRtYXAudXMvdmVjdGlsZXMtaGlnaHJvYWQvXCIsIGRbMl0sIFwiL1wiLCBkWzBdLCBcIi9cIiwgZFsxXSxcIi5qc29uXCJdLmpvaW4oJycpO1xuICAgICAgZDMuanNvbih1cmwsIGZ1bmN0aW9uKGVycm9yLCBqc29uKSB7XG4gICAgICAgIGcuc2VsZWN0QWxsKFwicGF0aFwiKVxuICAgICAgICAgICAgLmRhdGEoanNvbi5mZWF0dXJlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEucHJvcGVydGllcy5zb3J0X2tleSAtIGIucHJvcGVydGllcy5zb3J0X2tleTsgfSkpXG4gICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnByb3BlcnRpZXMua2luZDsgfSlcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBwYXRoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbi8vMzkuOTU2MTg0LCAtNzUuMTkxODAxIHNjZWluY2UgY2VudGVyXG4vLzM5Ljk1NTcwNSwgLTc1LjE4MjE0OCBhbXRyYWsgXG4iXX0=
