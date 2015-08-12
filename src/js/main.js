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
