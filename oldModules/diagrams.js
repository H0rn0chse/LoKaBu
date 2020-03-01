/**
 @typedef diagramSeries
 @type {object} A series of datapoints for generating a diagram
 @property {string} name Label of the series
 @property {number[]} values Values of the series
 */

/**
 @typedef diagramData
 @type {object} A complex data type for diagram generation
 @property {diagramSeries[]} series One or multiple series of datapoints
 @property {string[]} xLabels The Labels of the x-Axis
 */

/**
 * Draws an diagram based on the input data
 * @param {string} id The id of a <svg> element
 * @param {diagramData} data The input data
 * @param {number} svgWidth The desired width of the diagram
 * @returns {boolean} Whether the diagram was drawn or not
 */
function drawLineGraph(id, data, svgWidth){
	//empty svg
	d3.select(id).selectAll("*").remove();

	/*data = {
		series: [
			{name:string, values:[number,...]},
			...
		],
		xLabels: [string,...]
	};*/
	//validate data
	if(data.hasOwnProperty("series") && data.hasOwnProperty("xLabels")){
		if(data.series.length === 0 && data.xLabels.length === 0){
			return false; //serie or labels empty
		}
		data.series.forEach(function(item,index){
			if(item.hasOwnProperty("name") && item.hasOwnProperty("values")){
				if(item.values.length !== data.xLabels.length){
					return false; //values != labels
				}
			}else{
				return false; //series.name or series.values do not exist
			}
		});
	}else{
		return false; //data.series or data.xLabels do not exist
	}
	
	//final height of the svg
	var svgHeight = svgWidth*(2/3);
	//final margin of the svg
	var margin = { top: 20, right: 20, bottom: 30, left: 50 };
	//final width of the content
	var width = svgWidth - margin.left - margin.right;
	//final height of the content
	var height = svgHeight - margin.top - margin.bottom;

	var svg = d3.select(id)
		.attr("width", svgWidth)
		.attr("height", svgHeight);

	var color = d3.scaleOrdinal()
		.domain(Array.from(Array(data.xLabels.length).keys()))
		.range(d3.schemeCategory10);

	var x = d3.scaleLinear()
		.domain([0,data.xLabels.length-1])
		.range([margin.left, width - margin.right])

	var y = d3.scaleLinear()
		.domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
		.range([height - margin.bottom, margin.top])


	var line = d3.line()
		.defined(d => !isNaN(d))
		.x((d, i) => x(i))
		.y(d => y(d))

	var path = svg.append("g")
			.attr("fill", "none")
			.attr("stroke-width", 1.5)
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round")
		.selectAll("path")
		.data(data.series)
			.join("path")
			.style("mix-blend-mode", "multiply")
			.attr("d", d => line(d.values))
			.attr("stroke", (d,i) => color(i));

	var yAxis = svg.append("g")
	.attr("transform", `translate(0,${height - margin.bottom})`)
	.call(d3.axisBottom(x)
		.tickValues(Array.from(Array(data.xLabels.length).keys()))
		.tickFormat(function (d) {
			return data.xLabels[d];
	}))
		.selectAll("text")
			.attr("transform", "rotate(70)")
			.attr("x", 10)
			.attr("y", 0)
			.style("text-anchor", "start");
	
	var xAxis = svg.append("g")
	.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(y))
	
	/**
	 * hover function adds a cursor and hightlight for the hovered data path
	 * @param {{}} svg svg HTML element
	 * @param {{}} path data paths
	 */
	var hover = function(svg, path){
		if ("ontouchstart" in document) svg
			.on("touchmove", moved)
			.on("touchstart", entered)
			.on("touchend", left)
		else svg
			.on("mousemove", moved)
			.on("mouseenter", entered)
			.on("mouseleave", left);

		//cursor dot		
		var dot = svg.append("g")
			.attr("display", "none");

		dot.append("circle")
			.attr("r", 2.5);

		dot.append("text")
			.style("font", "10px sans-serif")
			.attr("text-anchor", "middle")
			.attr("y", -8);

		//moves the dot and highlights the hovered or last hovered data path
		function moved() {
			d3.event.preventDefault();

			/**
			 * relative y-Value of cursor position
			 * @type {number}
			 */
			var ym = y.invert(d3.event.layerY);
			/**
			 * relative x-Value of cursor position
			 * @type {number}
			 */
			var xm = x.invert(d3.event.layerX);
			/**
			 * next data point index according to the x-value
			 * @type {number}
			 */
			var i1 = d3.bisectLeft(Array.from(Array(data.xLabels.length).keys()), xm, 1);
			/**
			 * data point index before
			 * @type {number}
			 */
			var i0 = i1 - 1;
			/**
			 * final data point index covering both marginal cases
			 * @type {number}
			 */
			var i = xm - i0 > i1 - xm ? i1 : i0;
			/**
			 * hovered data series according to the y-value
			 * @type {diagramSeries}
			 */
			var s = data.series.reduce((a, b) => Math.abs(a.values[i] - ym) < Math.abs(b.values[i] - ym) ? a : b);
			
			if(typeof s.values[i] !== "undefined"){
				path.attr("stroke-opacity", d => d === s ? null : 0.2).filter(d => d === s).raise();
				dot.attr("transform", `translate(${x(i)},${y(s.values[i])})`);
				dot.select("text").text(s.name + " (" + s.values[i].toFixed(2) + ")");
			}
		}

		//de-highlights all data paths
		function entered() {
			path.style("mix-blend-mode", null).attr("stroke-opacity", 0.2);
			dot.attr("display", null);
		}

		//resets all data path to state before entering
		function left() {
			path.style("mix-blend-mode", "multiply").attr("stroke-opacity", 1);
			dot.attr("display", "none");
		}
	}
	
	//Add hover handler to svg element
	svg.call(hover, path);
	
	return true;
}