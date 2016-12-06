$(document).ready(function() {
	var NODE_RADIUS = 26;
	var SVG_WIDTH = $("#relation_chart").width();
	var SVG_HEIGHT = $("#relation_chart").height();
	var FORCE_LINK_DISTANCE_TIMES = 100;
	var FORCE_LINK_DISTANCE_MOVES = 100;
	var FORCE_CHARGE = -500;
	var NODE_TEXT_LENGTH = 9;
	var TEXT_SIZE = 17;
	var LINK_TEXT_LENGTH = 50;
	var LINK_VALUE_LENGTH = 18;
	var ATTR_RECT_RADIUS = 5;

	var svg = d3.select("#relation_chart");

	d3.json("data/relation.json", function(error, data) {

		if(error) {
			return console.log(error);
		}
		console.log(data);

		var text_dx = -20;
		var text_dy = 20;
		
		var nodes = data.nodes.concat(data.attrs);
		var add_links = [];
		for(var i = 0; i < data.links.length; i++){
			data.links[i].weight = data.links[i].weight * FORCE_LINK_DISTANCE_TIMES + FORCE_LINK_DISTANCE_MOVES;
			data.links[i].strength = 0;
		}
		for(var i = 0; i < data.nodes.length; i++){
			var link = {
				"source": i,
				"target": data.links.length + i,
				"type": "node_attr",
				"weight": NODE_RADIUS / 2,
				"strength": 1
			};
			add_links.push(link);
		}
		var links = data.links.concat(add_links);
		
		var force = d3.layout.force()
			.nodes(nodes)
			.links(links)
			.size([SVG_WIDTH, SVG_HEIGHT])
			.linkDistance(function(d){
				return d.weight;
			})
			.linkStrength(function(d){
				return d.strength;
			})
			.charge(FORCE_CHARGE)
			.start();

		var link_line = svg.selectAll(".link-line")
			.data(links)
			.enter()
			.append("line")
			.attr("class", "link-line");

		var link_text = svg.selectAll(".link-text")
			.data(data.links)
			.enter()
			.append("text")
			.attr("textLength", LINK_TEXT_LENGTH)
			.attr("dx", - LINK_TEXT_LENGTH / 2)
			.attr("class", "link-text")
			.text(function(d) {
				return d.text;
			});
			
		var link_value = svg.selectAll(".link-value")
			.data(data.links)
			.enter()
			.append("text")
			.attr("textLength", LINK_VALUE_LENGTH)
			.attr("dx", - LINK_VALUE_LENGTH / 2)
			.attr("dy", TEXT_SIZE / 2)
			.attr("class", "link-value")
			.text(function(d) {
				return d.value;
			});

		var node_point = svg.selectAll(".node-point")
			.data(data.nodes)
			.enter()
			.append("circle")
			.attr("r", NODE_RADIUS)
			.attr("class", "node-point")
			.call(force.drag);

		var node_text = svg.selectAll(".node-text")
			.data(data.nodes)
			.enter()
			.append("text")
			.attr("dx", - NODE_TEXT_LENGTH / 2)
			.attr("dy", TEXT_SIZE / 2)
			.attr("class", "node-text")
			.text(function(d) {
				return d.num;
			});
			
/*		var node_attr_text = svg.selectAll(".node-attr")
			.data(data.nodes)
			.enter()
			.append("text")
			.attr("dy", NODE_RADIUS + TEXT_SIZE)
			.attr("class", "node-attr")
			.text(function(d) {
				var text = "";
				if(d.name){
					text += "name=" + d.name + "\n";
				}
				if(d.age){
					text += "age=" + d.age + "\n";
				}
				if(d.long){
					text += "long=" + d.long;
				}
				return text;
			});*/
			
		var node_attr_rect = svg.selectAll(".node-attr-rect")
			.data(data.attrs)
			.enter()
			.append("rect")
			.attr("width", 100)
			.attr("height", 50)
			.attr("rx", ATTR_RECT_RADIUS)
			.attr("ry", ATTR_RECT_RADIUS)
			.attr("class", "node-attr-rect")
			.call(force.drag);

		force.on("tick", function() {

			data.nodes.forEach(function(d, i) {
				d.x = d.x - NODE_RADIUS / 2 < 0 ? NODE_RADIUS / 2 : d.x;
				d.x = d.x + NODE_RADIUS / 2 > SVG_WIDTH ? SVG_WIDTH - NODE_RADIUS / 2 : d.x;
				d.y = d.y - NODE_RADIUS / 2 < 0 ? NODE_RADIUS / 2 : d.y;
				d.y = d.y + NODE_RADIUS / 2 + text_dy > SVG_HEIGHT ? SVG_HEIGHT - NODE_RADIUS / 2 - text_dy : d.y;
			});
			
			node_point.attr("cx", function(d) {
					return d.x - NODE_RADIUS / 2;
				})
				.attr("cy", function(d) {
					return d.y - NODE_RADIUS / 2;
				});

			node_text.attr("x", function(d) {
					return d.x - NODE_RADIUS / 2;
				})
				.attr("y", function(d) {
					return d.y - NODE_RADIUS / 2;
				});
			
/*			node_attr_text.attr("x", function(d) {
					return d.x;
				})
				.attr("y", function(d) {
					return d.y
				});
*/

			node_attr_rect.attr("x", function(d) {
					return d.x - 50;
				})
				.attr("y", function(d) {
					return d.y - 25
				});

			link_line.attr("x1", function(d) {
					return d.source.x - NODE_RADIUS / 2;
				})
				.attr("y1", function(d) {
					return d.source.y - NODE_RADIUS / 2;
				})
				.attr("x2", function(d) {
					return d.target.x - NODE_RADIUS / 2;
				})
				.attr("y2", function(d) {
					return d.target.y - NODE_RADIUS / 2;
				});

			link_text.attr("x", function(d) {
					return (d.target.x - d.source.x) / 3 * 2 + d.source.x;
				})
				.attr("y", function(d) {
					return (d.target.y - d.source.y) / 3 * 2 + d.source.y;
				});
				
			link_value.attr("x", function(d) {
					return (d.target.x - d.source.x) / 3 + d.source.x;
				})
				.attr("y", function(d) {
					return (d.target.y - d.source.y) / 3 + d.source.y;
				});
				
			

		});
	});
});