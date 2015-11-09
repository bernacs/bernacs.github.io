d3.select(window).on("load", draw);

function draw() {
  // console.log("entered draw()");

  var thumbSize = 150,
      thumbOffset = -(thumbSize / 2);

  var width = $(window).width(),
      height = $(window).height(),
      root;

  var force = d3.layout.force()
                .linkDistance(180)
                .charge(-400)
                .gravity(.02)
                .on("tick", tick);

  var svg = d3.select("#graph")
              .append("svg");

  var link = svg.selectAll(".link"),
      node = svg.selectAll(".node");

  resize();

  d3.json("/assets/json/graph.json", function(err, data) {
    if (err) {
      console.log("json error", data);
    };
    root = data;
    update();
  });

  function resize() {
    // console.log('entered resize()');

    width = $(window).width();
    height = $(window).height();

    svg.attr('width', width).attr('height', height)
      .attr("viewBox", "0 0 " + width + " " + height);
    force.size([width, height]).resume();
  }

  d3.select(window).on("resize", resize);

  function update() {
    // console.log("entered update()");

    var nodes = flatten(root),
        links = d3.layout.tree().links(nodes);

    force.nodes(nodes)
         .links(links)
         .start();

    link = link.data(links, function(e) {
      return e.target.id;
    })

    link.exit().remove();

    link.enter()
        .insert("line", ".node")
        .attr("class", "link");

    node = node.data(nodes, function(e) {
      return e.id;
    })

    node.exit().remove();

    var nodeEnter = node.enter()
                        .append("g")
                        .attr("class", "node")
                        .call(force.drag);

    nodeEnter
      .append("a")
      .attr("target", "_self")
      .attr("xlink:href", function(e) {
        return e.link;
      })
      .append("image")
      .attr('class', 'thumb')
      .attr("x", thumbOffset)
      .attr("y", thumbOffset)
      .attr('width', thumbSize)
      .attr('height', thumbSize)
      .attr("xlink:href", function(e) {
        if (e.img) {
          return e.img;
        } else{
          return "http://ima.gs/transparent/150x150.png";
        };
      });

    nodeEnter
      .append("text")
      .attr('class','caption')
      .attr('text-anchor', 'middle')
      .attr('dy', function(e) {
        if (e.offset) {
          return -(thumbOffset) + 20 - e.offset;
        } else {
          return -(thumbOffset) + 20;
        };
      })
      .text(function(e) {
        return e.name;
      });
  }

  function tick() {
    link.attr("x1", function(e) {
            return e.source.x;
        })
        .attr("y1", function(e) {
            return e.source.y;
        })
        .attr("x2", function(e) {
            return e.target.x;
        })
        .attr("y2", function(e) {
            return e.target.y;
        });

    node.attr("transform", function(e) {
        return "translate(" + e.x + "," + e.y + ")";
    });
  }

  function flatten(root) {
    var nodes = [],
        i = 0;

    function recurse(node) {
      if (node.children) {
        node.children.forEach(recurse);
      };
      if (!node.id) {
        node.id = ++i;
      };
      nodes.push(node);
    }

    recurse(root);
    return nodes;
  }
}