(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function d3Map (container, id, opts) {
  
  var width = opts.width || window.innerWidth,
    height = opts.height || window.innerHeight,
    lat = opts.lat,
    lon = opts.lon,
    zoom = opts.zoom,
    prefix = prefixMatch(["webkit", "ms", "Moz", "O"]);

  var tile = d3.geo.tile()
    .size([width, height]);

  var projection = d3.geo.mercator()
    .scale((1 << zoom) / 2 / Math.PI)
    .translate([-width / 2, -height / 2]);

  var zoom = d3.behavior.zoom()
    .scale(projection.scale() * 2 * Math.PI)
    .scaleExtent([1 << 12, 1 << 25]) // 12 to 25 is roughly z4-z5 to z17
    .translate(projection([lon, lat]).map(function(x) { return -x; }))
    .on("zoom", zoomed);

  var map = d3.select(container).append("div")
    .attr("id", id)
    .style("width", width + "px")
    .style("height", height + "px")
    .call(zoom);

  var layer = map.append("div")
    .attr("class", "layer");

   var info = map.append("div")
    .attr("class", "info")
    .html('<a href="http://bl.ocks.org/mbostock/5593150" target="_top">Mike Bostock</a> | © <a href="https://www.openstreetmap.  org/copyright" target="_top">OpenStreetMap contributors</a> | <a href="https://mapzen.com/projects/vector-tiles" title="Tiles    courtesy of Mapzen" target="_top">Mapzen</a>');

  zoomed();

  window.onresize = function () {
    width = window.innerWidth;
    height = window.innerHeight;
    map.style("width", width + "px")
      .style("height", height + "px");
    tile = d3.geo.tile()
      .size([width, height]);
    zoomed();
  };

  function zoomed() {
    var tiles = tile
        .scale(zoom.scale())
        .translate(zoom.translate())
        ();
  
    projection
        .scale(zoom.scale() / 2 / Math.PI)
        .translate(zoom.translate());
  
    var image = layer
        .style(prefix + "transform", matrix3d(tiles.scale, tiles.translate))
      .selectAll(".tile")
        .data(tiles, function(d) { return d; });
  
    image.exit()
        .each(function(d) { this._xhr.abort(); })
        .remove();
  
    image.enter().append("svg")
        .attr("class", "tile")
        .style("left", function(d) { return d[0] * 256 + "px"; })
        .style("top", function(d) { return d[1] * 256 + "px"; })
        .each(renderTiles);
  }
  
  function matrix3d(scale, translate) {
    var k = scale / 256, r = scale % 1 ? Number : Math.round;
    return "matrix3d(" + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] * scale), r(translate[1] * scale), 0, 1 ] + ")";
  }
  
  function prefixMatch(p) {
    var i = -1, n = p.length, s = document.body.style;
    while (++i < n) if (p[i] + "Transform" in s) return "-" + p[i].toLowerCase() + "-";
    return "";
  }
  
  map.on("wheel.zoom", null);

  function renderTiles (d) {
    var svg = d3.select(this);
    this._xhr = d3.json("https://vector.mapzen.com/osm/all/" + d[2] + "/" + d[0] + "/" + d[1] + ".topojson?api_key=vector-tiles-88szoJk", function(error, json) {
      var k = Math.pow(2, d[2]) * 256; // size of the world in pixels

      var tileProjection = d3.geo.mercator();

      var tilePath = d3.geo.path()
        .projection(tileProjection);

      tilePath.projection()
          .translate([k / 2 - d[0] * 256, k / 2 - d[1] * 256]) // [0°,0°] in pixels
          .scale(k / 2 / Math.PI);

      var data = {};
      for (var key in json.objects) {
        data[key] = topojson.feature(json, json.objects[key]);
      }

      ['water', 'landuse', 'roads', 'buildings'].forEach(function(layer){
        var layer_data = data[layer];
        if (layer_data) {
          if (layer === 'buildings') {
//            console.log(layer_data.features);
          }
          svg.selectAll("path")
            .data(layer_data.features.sort(function(a, b) { return a.properties.sort_key ? a.properties.sort_key - b.properties. sort_key : 0 }))
          .enter().append("path")
            .attr("class", function(d) { var kind = d.properties.kind || ''; return layer + '-layer ' + kind; })
            .attr("d", tilePath)
            .on('click', function(d){
              console.log(d);
            });
        }
      });
    });
  };

  return map;
}

// refactor into an object...
var opts = {
  zoom: 21,
  lon: -75.1667, 
  lat: 39.9500,
  width: window.innerWidth, 
  height: 425
};
var bannerMap = d3Map('#banner', 'philly-map', opts); 

opts.zoom = 23;
opts.height = 300;
opts.lat = 39.956184;
opts.lon = -75.194901;
var venueMap = d3Map('#venue', 'venue-map', opts); 

var mapData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "30th Street Station"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -75.18321990966797,
          39.95490194495432
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "University Science Center"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -75.19728541374207,
          39.95665367517976
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            -75.18328428268433,
            39.95481970299595
          ],
          [
            -75.18978595733643,
            39.95569146272268
          ],
          [
            -75.19731760025024,
            39.95661255526619
          ]
        ]
      }
    }
  ]
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBkM01hcCAoY29udGFpbmVyLCBpZCwgb3B0cykge1xuICBcbiAgdmFyIHdpZHRoID0gb3B0cy53aWR0aCB8fCB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICBoZWlnaHQgPSBvcHRzLmhlaWdodCB8fCB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgbGF0ID0gb3B0cy5sYXQsXG4gICAgbG9uID0gb3B0cy5sb24sXG4gICAgem9vbSA9IG9wdHMuem9vbSxcbiAgICBwcmVmaXggPSBwcmVmaXhNYXRjaChbXCJ3ZWJraXRcIiwgXCJtc1wiLCBcIk1velwiLCBcIk9cIl0pO1xuXG4gIHZhciB0aWxlID0gZDMuZ2VvLnRpbGUoKVxuICAgIC5zaXplKFt3aWR0aCwgaGVpZ2h0XSk7XG5cbiAgdmFyIHByb2plY3Rpb24gPSBkMy5nZW8ubWVyY2F0b3IoKVxuICAgIC5zY2FsZSgoMSA8PCB6b29tKSAvIDIgLyBNYXRoLlBJKVxuICAgIC50cmFuc2xhdGUoWy13aWR0aCAvIDIsIC1oZWlnaHQgLyAyXSk7XG5cbiAgdmFyIHpvb20gPSBkMy5iZWhhdmlvci56b29tKClcbiAgICAuc2NhbGUocHJvamVjdGlvbi5zY2FsZSgpICogMiAqIE1hdGguUEkpXG4gICAgLnNjYWxlRXh0ZW50KFsxIDw8IDEyLCAxIDw8IDI1XSkgLy8gMTIgdG8gMjUgaXMgcm91Z2hseSB6NC16NSB0byB6MTdcbiAgICAudHJhbnNsYXRlKHByb2plY3Rpb24oW2xvbiwgbGF0XSkubWFwKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIC14OyB9KSlcbiAgICAub24oXCJ6b29tXCIsIHpvb21lZCk7XG5cbiAgdmFyIG1hcCA9IGQzLnNlbGVjdChjb250YWluZXIpLmFwcGVuZChcImRpdlwiKVxuICAgIC5hdHRyKFwiaWRcIiwgaWQpXG4gICAgLnN0eWxlKFwid2lkdGhcIiwgd2lkdGggKyBcInB4XCIpXG4gICAgLnN0eWxlKFwiaGVpZ2h0XCIsIGhlaWdodCArIFwicHhcIilcbiAgICAuY2FsbCh6b29tKTtcblxuICB2YXIgbGF5ZXIgPSBtYXAuYXBwZW5kKFwiZGl2XCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBcImxheWVyXCIpO1xuXG4gICB2YXIgaW5mbyA9IG1hcC5hcHBlbmQoXCJkaXZcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIFwiaW5mb1wiKVxuICAgIC5odG1sKCc8YSBocmVmPVwiaHR0cDovL2JsLm9ja3Mub3JnL21ib3N0b2NrLzU1OTMxNTBcIiB0YXJnZXQ9XCJfdG9wXCI+TWlrZSBCb3N0b2NrPC9hPiB8IMKpIDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLiAgb3JnL2NvcHlyaWdodFwiIHRhcmdldD1cIl90b3BcIj5PcGVuU3RyZWV0TWFwIGNvbnRyaWJ1dG9yczwvYT4gfCA8YSBocmVmPVwiaHR0cHM6Ly9tYXB6ZW4uY29tL3Byb2plY3RzL3ZlY3Rvci10aWxlc1wiIHRpdGxlPVwiVGlsZXMgICAgY291cnRlc3kgb2YgTWFwemVuXCIgdGFyZ2V0PVwiX3RvcFwiPk1hcHplbjwvYT4nKTtcblxuICB6b29tZWQoKTtcblxuICB3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgbWFwLnN0eWxlKFwid2lkdGhcIiwgd2lkdGggKyBcInB4XCIpXG4gICAgICAuc3R5bGUoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgXCJweFwiKTtcbiAgICB0aWxlID0gZDMuZ2VvLnRpbGUoKVxuICAgICAgLnNpemUoW3dpZHRoLCBoZWlnaHRdKTtcbiAgICB6b29tZWQoKTtcbiAgfTtcblxuICBmdW5jdGlvbiB6b29tZWQoKSB7XG4gICAgdmFyIHRpbGVzID0gdGlsZVxuICAgICAgICAuc2NhbGUoem9vbS5zY2FsZSgpKVxuICAgICAgICAudHJhbnNsYXRlKHpvb20udHJhbnNsYXRlKCkpXG4gICAgICAgICgpO1xuICBcbiAgICBwcm9qZWN0aW9uXG4gICAgICAgIC5zY2FsZSh6b29tLnNjYWxlKCkgLyAyIC8gTWF0aC5QSSlcbiAgICAgICAgLnRyYW5zbGF0ZSh6b29tLnRyYW5zbGF0ZSgpKTtcbiAgXG4gICAgdmFyIGltYWdlID0gbGF5ZXJcbiAgICAgICAgLnN0eWxlKHByZWZpeCArIFwidHJhbnNmb3JtXCIsIG1hdHJpeDNkKHRpbGVzLnNjYWxlLCB0aWxlcy50cmFuc2xhdGUpKVxuICAgICAgLnNlbGVjdEFsbChcIi50aWxlXCIpXG4gICAgICAgIC5kYXRhKHRpbGVzLCBmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KTtcbiAgXG4gICAgaW1hZ2UuZXhpdCgpXG4gICAgICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHsgdGhpcy5feGhyLmFib3J0KCk7IH0pXG4gICAgICAgIC5yZW1vdmUoKTtcbiAgXG4gICAgaW1hZ2UuZW50ZXIoKS5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRpbGVcIilcbiAgICAgICAgLnN0eWxlKFwibGVmdFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkWzBdICogMjU2ICsgXCJweFwiOyB9KVxuICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZFsxXSAqIDI1NiArIFwicHhcIjsgfSlcbiAgICAgICAgLmVhY2gocmVuZGVyVGlsZXMpO1xuICB9XG4gIFxuICBmdW5jdGlvbiBtYXRyaXgzZChzY2FsZSwgdHJhbnNsYXRlKSB7XG4gICAgdmFyIGsgPSBzY2FsZSAvIDI1NiwgciA9IHNjYWxlICUgMSA/IE51bWJlciA6IE1hdGgucm91bmQ7XG4gICAgcmV0dXJuIFwibWF0cml4M2QoXCIgKyBbaywgMCwgMCwgMCwgMCwgaywgMCwgMCwgMCwgMCwgaywgMCwgcih0cmFuc2xhdGVbMF0gKiBzY2FsZSksIHIodHJhbnNsYXRlWzFdICogc2NhbGUpLCAwLCAxIF0gKyBcIilcIjtcbiAgfVxuICBcbiAgZnVuY3Rpb24gcHJlZml4TWF0Y2gocCkge1xuICAgIHZhciBpID0gLTEsIG4gPSBwLmxlbmd0aCwgcyA9IGRvY3VtZW50LmJvZHkuc3R5bGU7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmIChwW2ldICsgXCJUcmFuc2Zvcm1cIiBpbiBzKSByZXR1cm4gXCItXCIgKyBwW2ldLnRvTG93ZXJDYXNlKCkgKyBcIi1cIjtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBcbiAgbWFwLm9uKFwid2hlZWwuem9vbVwiLCBudWxsKTtcblxuICBmdW5jdGlvbiByZW5kZXJUaWxlcyAoZCkge1xuICAgIHZhciBzdmcgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgdGhpcy5feGhyID0gZDMuanNvbihcImh0dHBzOi8vdmVjdG9yLm1hcHplbi5jb20vb3NtL2FsbC9cIiArIGRbMl0gKyBcIi9cIiArIGRbMF0gKyBcIi9cIiArIGRbMV0gKyBcIi50b3BvanNvbj9hcGlfa2V5PXZlY3Rvci10aWxlcy04OHN6b0prXCIsIGZ1bmN0aW9uKGVycm9yLCBqc29uKSB7XG4gICAgICB2YXIgayA9IE1hdGgucG93KDIsIGRbMl0pICogMjU2OyAvLyBzaXplIG9mIHRoZSB3b3JsZCBpbiBwaXhlbHNcblxuICAgICAgdmFyIHRpbGVQcm9qZWN0aW9uID0gZDMuZ2VvLm1lcmNhdG9yKCk7XG5cbiAgICAgIHZhciB0aWxlUGF0aCA9IGQzLmdlby5wYXRoKClcbiAgICAgICAgLnByb2plY3Rpb24odGlsZVByb2plY3Rpb24pO1xuXG4gICAgICB0aWxlUGF0aC5wcm9qZWN0aW9uKClcbiAgICAgICAgICAudHJhbnNsYXRlKFtrIC8gMiAtIGRbMF0gKiAyNTYsIGsgLyAyIC0gZFsxXSAqIDI1Nl0pIC8vIFswwrAsMMKwXSBpbiBwaXhlbHNcbiAgICAgICAgICAuc2NhbGUoayAvIDIgLyBNYXRoLlBJKTtcblxuICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgIGZvciAodmFyIGtleSBpbiBqc29uLm9iamVjdHMpIHtcbiAgICAgICAgZGF0YVtrZXldID0gdG9wb2pzb24uZmVhdHVyZShqc29uLCBqc29uLm9iamVjdHNba2V5XSk7XG4gICAgICB9XG5cbiAgICAgIFsnd2F0ZXInLCAnbGFuZHVzZScsICdyb2FkcycsICdidWlsZGluZ3MnXS5mb3JFYWNoKGZ1bmN0aW9uKGxheWVyKXtcbiAgICAgICAgdmFyIGxheWVyX2RhdGEgPSBkYXRhW2xheWVyXTtcbiAgICAgICAgaWYgKGxheWVyX2RhdGEpIHtcbiAgICAgICAgICBpZiAobGF5ZXIgPT09ICdidWlsZGluZ3MnKSB7XG4vLyAgICAgICAgICAgIGNvbnNvbGUubG9nKGxheWVyX2RhdGEuZmVhdHVyZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdmcuc2VsZWN0QWxsKFwicGF0aFwiKVxuICAgICAgICAgICAgLmRhdGEobGF5ZXJfZGF0YS5mZWF0dXJlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEucHJvcGVydGllcy5zb3J0X2tleSA/IGEucHJvcGVydGllcy5zb3J0X2tleSAtIGIucHJvcGVydGllcy4gc29ydF9rZXkgOiAwIH0pKVxuICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCkgeyB2YXIga2luZCA9IGQucHJvcGVydGllcy5raW5kIHx8ICcnOyByZXR1cm4gbGF5ZXIgKyAnLWxheWVyICcgKyBraW5kOyB9KVxuICAgICAgICAgICAgLmF0dHIoXCJkXCIsIHRpbGVQYXRoKVxuICAgICAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gbWFwO1xufVxuXG4vLyByZWZhY3RvciBpbnRvIGFuIG9iamVjdC4uLlxudmFyIG9wdHMgPSB7XG4gIHpvb206IDIxLFxuICBsb246IC03NS4xNjY3LCBcbiAgbGF0OiAzOS45NTAwLFxuICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsIFxuICBoZWlnaHQ6IDQyNVxufTtcbnZhciBiYW5uZXJNYXAgPSBkM01hcCgnI2Jhbm5lcicsICdwaGlsbHktbWFwJywgb3B0cyk7IFxuXG5vcHRzLnpvb20gPSAyMztcbm9wdHMuaGVpZ2h0ID0gMzAwO1xub3B0cy5sYXQgPSAzOS45NTYxODQ7XG5vcHRzLmxvbiA9IC03NS4xOTQ5MDE7XG52YXIgdmVudWVNYXAgPSBkM01hcCgnI3ZlbnVlJywgJ3ZlbnVlLW1hcCcsIG9wdHMpOyBcblxudmFyIG1hcERhdGEgPSB7XG4gIFwidHlwZVwiOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gIFwiZmVhdHVyZXNcIjogW1xuICAgIHtcbiAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAgICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIjMwdGggU3RyZWV0IFN0YXRpb25cIlxuICAgICAgfSxcbiAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJQb2ludFwiLFxuICAgICAgICBcImNvb3JkaW5hdGVzXCI6IFtcbiAgICAgICAgICAtNzUuMTgzMjE5OTA5NjY3OTcsXG4gICAgICAgICAgMzkuOTU0OTAxOTQ0OTU0MzJcbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgXCJ0eXBlXCI6IFwiRmVhdHVyZVwiLFxuICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiVW5pdmVyc2l0eSBTY2llbmNlIENlbnRlclwiXG4gICAgICB9LFxuICAgICAgXCJnZW9tZXRyeVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIlBvaW50XCIsXG4gICAgICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuICAgICAgICAgIC03NS4xOTcyODU0MTM3NDIwNyxcbiAgICAgICAgICAzOS45NTY2NTM2NzUxNzk3NlxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBcInR5cGVcIjogXCJGZWF0dXJlXCIsXG4gICAgICBcInByb3BlcnRpZXNcIjoge30sXG4gICAgICBcImdlb21ldHJ5XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiTGluZVN0cmluZ1wiLFxuICAgICAgICBcImNvb3JkaW5hdGVzXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICAtNzUuMTgzMjg0MjgyNjg0MzMsXG4gICAgICAgICAgICAzOS45NTQ4MTk3MDI5OTU5NVxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgLTc1LjE4OTc4NTk1NzMzNjQzLFxuICAgICAgICAgICAgMzkuOTU1NjkxNDYyNzIyNjhcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIC03NS4xOTczMTc2MDAyNTAyNCxcbiAgICAgICAgICAgIDM5Ljk1NjYxMjU1NTI2NjE5XG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfVxuICBdXG59XG4iXX0=
