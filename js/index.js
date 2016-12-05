$(document).ready(function() {
	var NODE_RADIUS = 25;
	var SVG_WIDTH = $("#relation_map").width();
	var SVG_HEIGHT = $("#relation_map").height();
	
	var svg = d3.select("#relation_map");

	d3.json("data/relation.json", function(error, root) {

		if(error) {
			return console.log(error);
		}
		console.log(root);

		var force = d3.layout.force()
			.nodes(root.nodes)
			.links(root.relations)
			.size([SVG_WIDTH, SVG_HEIGHT])
			.linkDistance(200)
			.charge(-1500)
			.start();

		var relation_line = svg.selectAll(".line")
			.data(root.relations)
			.enter()
			.append("line")
			.attr("class", "line");

		var relation_text = svg.selectAll(".line-text")
			.data(root.relations)
			.enter()
			.append("text")
			.attr("class", "line-text")
			.text(function(d) {
				return d.text;
			});

		var node_point = svg.selectAll(".point")
			.data(root.nodes)
			.enter()
			.append("circle")
			.attr("r", NODE_RADIUS)
			.attr("class", "point")
			.on("mouseover", function(d, i) {
				relation_text.style("fill-opacity", function(edge) {
					if(edge.source === d || edge.target === d) {
						return 1.0;
					}
				});
			})
			.on("mouseout", function(d, i) {
				relation_text.style("fill-opacity", function(edge) {
					if(edge.source === d || edge.target === d) {
						return 0.0;
					}
				});
			})
			.call(force.drag);

		var text_dx = -20;
		var text_dy = 20;

		var node_text = svg.selectAll(".point-text")
			.data(root.nodes)
			.enter()
			.append("text")
			.attr("class", "node-text")
			.attr("dx", text_dx)
			.attr("dy", text_dy)
			.text(function(d) {
				return d.name;
			});

		force.on("tick", function() {

			root.nodes.forEach(function(d, i) {
				d.x = d.x - NODE_RADIUS / 2 < 0 ? NODE_RADIUS / 2 : d.x;
				d.x = d.x + NODE_RADIUS / 2 > SVG_WIDTH ? SVG_WIDTH - NODE_RADIUS / 2 : d.x;
				d.y = d.y - NODE_RADIUS / 2 < 0 ? NODE_RADIUS / 2 : d.y;
				d.y = d.y + NODE_RADIUS / 2 + text_dy > SVG_HEIGHT ? SVG_HEIGHT - NODE_RADIUS / 2 - text_dy : d.y;
			});

			relation_line.attr("x1", function(d) {
				return d.source.x;
			});
			relation_line.attr("y1", function(d) {
				return d.source.y;
			});
			relation_line.attr("x2", function(d) {
				return d.target.x;
			});
			relation_line.attr("y2", function(d) {
				return d.target.y;
			});

			relation_text.attr("x", function(d) {
				return(d.source.x + d.target.x) / 2;
			});
			relation_text.attr("y", function(d) {
				return(d.source.y + d.target.y) / 2;
			});

			node_point.attr("cx", function(d) {
				return d.x - NODE_RADIUS / 2;
			});
			node_point.attr("cy", function(d) {
				return d.y - NODE_RADIUS / 2;
			});

			node_text.attr("x", function(d) {
				return d.x
			});
			node_text.attr("y", function(d) {
				return d.y + NODE_RADIUS / 2;
			});
		});
	});
});