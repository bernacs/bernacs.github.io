const svg = d3.select("#graph");

function getWindowSize() {
  const w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName("body")[0];
  var x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight;
  return {
    width: x,
    height: y
  };
};

function updateGraphSize() {
  const window_size = getWindowSize();
  svg
    .attr("width", window_size.width)
    .attr("height", window_size.height)
    .attr("viewBox", "0 0 " + window_size.width + " " + window_size.height);
};

updateGraphSize();
window.onresize = updateGraphSize;

const constants = {
  bounds: {
    radius: 0,
    active: true
  },
  link: {
    distance: 100,
    strength: 0.5
  },
  physics: {
    charge_strength: -50,
    collision_radius: 20
  },
  opacity: {
    full: 0.9,
    dimmed: 0.5
  },
  alpha: {
    base: 0.5,
    min: 0.01,
    decay: 0.001
  },
  styles: {
    wider: {
      width: 200,
      height: 80,
      rx: 10,
      ry: 10
    },
    wide: {
      width: 150,
      height: 80,
      rx: 10,
      ry: 10
    },
    large: {
      width: 120,
      height: 80,
      rx: 10,
      ry: 10
    },
    medium: {
      width: 115,
      height: 70,
      rx: 10,
      ry: 10
    },
    small: {
      width: 90,
      height: 50,
      rx: 10,
      ry: 10
    },
    tiny: {
      width: 70,
      height: 25,
      rx: 10,
      ry: 10
    },
    node: {
      width: 10,
      height: 10,
      rx: 10,
      ry: 10
    }
  }
};

d3.json("assets/data/phd.json").then(graph => {
  const graphLayout = d3
    .forceSimulation(graph.nodes)
    .alpha(constants.alpha.base)
    .alphaMin(constants.alpha.min)
    .alphaDecay(constants.alpha.decay)
    .force(
      "charge",
      d3.forceManyBody().strength(constants.physics.charge_strength)
    )
    .force(
      "center",
      d3.forceCenter(getWindowSize().width / 2, getWindowSize().height / 2)
    )
    .force(
      "link",
      d3
        .forceLink(graph.links)
        .id(d => d.id)
        .distance(constants.link.distance)
        .strength(constants.link.strength)
    )
    .force(
      "collision",
      d3.forceCollide().radius(constants.physics.collision_radius)
    )
    .on("tick", ticked);

  const adjacency_mapping = new Map();
  const neigh = (a, b) => a == b || adjacency_mapping[a + " > " + b];

  graph.links.forEach(link => {
    adjacency_mapping[link.source.index + " > " + link.target.index] = true;
    adjacency_mapping[link.target.index + " > " + link.source.index] = true;
  });

  const container = svg.append("g").attr("class", "m-g");

  const link = container
    .append("g")
    .attr("class", "l-g")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("stroke-width", d => 1 + d.group + d3.randomUniform(0.0, 2.0)());

  const node = container
    .append("g")
    .attr("class", "n-g")
    .selectAll("g")
    .data(graph.nodes)
    .enter()
    .append("g")
    .attr("class", "n-e");

  const getStyle = (type, prop) => {
    return constants.styles[type] != undefined
      ? constants.styles[type][prop]
      : constants.styles["small"][prop];
  };

  node
    .append("rect")
    .attr("width", d => getStyle(d.size, "width"))
    .attr("height", d => getStyle(d.size, "height"))
    .attr("x", d => -Math.floor(getStyle(d.size, "width") / 2))
    .attr("y", d => -Math.floor(getStyle(d.size, "height") / 2))
    .attr("rx", d => getStyle(d.size, "rx"))
    .attr("ry", d => getStyle(d.size, "ry"))
    .attr("class", d => d.class);

  node
    .filter(d => d.class != "image")
    .append("foreignObject")
    .attr("width", d => getStyle(d.size, "width"))
    .attr("height", d => getStyle(d.size, "height"))
    .attr("x", d => -Math.floor(getStyle(d.size, "width") / 2))
    .attr("y", d => -Math.floor(getStyle(d.size, "height") / 2))
    .append("xhtml:div")
    .attr("class", "clabel")
    .append("xhtml:p")
    .attr("class", "label")
    .text((d, i) => d.text);

  // formulas
  // H(x) = \mathbb{E}_{x \sim P}\left[I(x) \right ] = -\mathbb{E}_{x \sim P}\left[\log P(x)) \right ]
  // H = -\sum_i p_i \log_b p_i

  node
    .filter(d => d.class == "image")
    .append("image")
    .attr("xlink:href", d => d.file)
    .attr("width", d => getStyle(d.size, "width"))
    .attr("height", d => getStyle(d.size, "height"))
    .attr("x", d => -Math.floor(getStyle(d.size, "width") / 2))
    .attr("y", d => -Math.floor(getStyle(d.size, "height") / 2));

  node.on("mouseover", focus).on("mouseout", unfocus);
  node.call(
    d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
  );

  function ticked() {
    node.call(updateNode);
    link.call(updateLink);
  }

  function fixna(x) {
    return isFinite(x) ? x : 0;
  }

  function focus(d) {
    const index = d3.select(d3.event.target).datum().index;
    node.style("opacity", o =>
      neigh(index, o.index) ? constants.opacity.full : constants.opacity.dimmed
    );
    link.style("opacity", o =>
      o.source.index == index || o.target.index == index
        ? constants.opacity.full
        : constants.opacity.dimmed
    );
  }

  function unfocus() {
    node.style("opacity", constants.opacity.full);
    link.style("opacity", constants.opacity.full);
  }

  function getBoundPosition(p, width, height) {
    if (constants.bounds.active) {
      return {
        x: fixna(
          Math.max(
            constants.bounds.radius,
            Math.min(width - constants.bounds.radius, p.x)
          )
        ),
        y: fixna(
          Math.max(
            constants.bounds.radius,
            Math.min(height - constants.bounds.radius, p.y)
          )
        )
      };
    } else {
      return {
        x: fixna(p.x),
        y: fixna(p.y)
      };
    }
  }

  function updateLink(link) {
    const { width, height } = getWindowSize();

    link
      .attr("x1", d => getBoundPosition(d.source, width, height).x)
      .attr("y1", d => getBoundPosition(d.source, width, height).y)
      .attr("x2", d => getBoundPosition(d.target, width, height).x)
      .attr("y2", d => getBoundPosition(d.target, width, height).y);
  }

  function updateNode(node) {
    const { width, height } = getWindowSize();

    node.attr("transform", d => {
      const p = getBoundPosition(d, width, height);
      return "translate(" + p.x + "," + p.y + ")";
    });
  }

  function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) graphLayout.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
});
