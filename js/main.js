// I. Global variables
// using d3 for convenience
// var container = d3.select('main');
var container = d3.select('#scroll');

var graphic = container.select('.scroll__graphic');
var chart = container.select('.chart');

var text = container.select('.scroll__text');
var step = text.selectAll('.step');

// var article = scrolly.select('.scroll__text'); // same
// var step = article.selectAll('.step');

// initialize the scrollama
var scroller = scrollama();

// II. Function to handle resize
// generic window resize listener event
function handleResize() {
	// 1. update height of step elements
	var stepH = Math.floor(window.innerHeight * 0.75);
	step.style('height', stepH + 'px');
	var chartHeight = window.innerHeight / 2;
	var chartMarginTop = (window.innerHeight - chartHeight) / 2;
	chart.style('height', chartHeight + 'px').style('top', chartMarginTop + 'px');
	// 3. tell scrollama to update new element dimensions
	scroller.resize();
}

// III. Functions to handle the scrollama callback events
// 1. Here we can trigger changes to the chart by handling which step becomes active.
function handleStepEnter(response) {
	console.log(response);
	// response = { element, direction, index }

	// add color to current step only
	step.classed('is-active', function(d, i) {
		return i === response.index;
	});

	// update graphic based on step
	const chartTitle = chart.select('.chart-title');
	let chartContent = chart.select('.chart-content');

	chartTitle.text(`mapa info ${response.index + 1}`);

	// test with graphic stuff
	if (response.index === 0) {
		chartContent.select('p').text('soy el primer step');

		if (response.direction === 'up') {
			sortBars();
		}
	}
	if (response.index === 1) {
		chartContent.select('p').text('soy el segundo step');
		sortBars();
	}
	if (response.index === 2) {
		chartContent.select('p').text('soy el tercer step');
		sortBars();
	}
	if (response.index === 3 && response.direction === 'down') {
		chartContent.select('p').text('soy el cuarto step');
		sortBars();
	}
}

function setupStickyfill() {
	d3.selectAll('.sticky').each(function() {
		Stickyfill.add(this);
	});
}

// IV. Function to set things up
// kick-off code to run once on load
function init() {
	setupStickyfill();
	// 1. force a resize on load to ensure proper dimensions are sent to scrollama
	handleResize();
	// 2. setup the scroller passing options
	// 		this will also initialize trigger observations
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller
		.setup({
			step: '#scroll .scroll__text .step', // The steps, could be whatever
			offset: 0.5, // Default is 0.5: half of screen
			debug: false
		})
		.onStepEnter(handleStepEnter);
	// setup resize event
	window.addEventListener('resize', handleResize);
}
// kick things off
init();

// CHART LOGIC
//Width and height
var w = 600;
var h = 250;

var dataset = [
	5,
	10,
	13,
	19,
	21,
	25,
	22,
	18,
	15,
	13,
	11,
	12,
	15,
	20,
	18,
	17,
	16,
	18,
	23,
	25
];

var xScale = d3
	.scaleBand()
	.domain(d3.range(dataset.length))
	.rangeRound([0, w])
	.paddingInner(0.05);

var yScale = d3
	.scaleLinear()
	.domain([0, d3.max(dataset)])
	.range([0, h]);

//Create SVG element
var svg = d3
	// .select('body')
	.select('.chart-content')
	.append('svg')
	.attr('width', w)
	.attr('height', h);

//Create bars
svg
	.selectAll('rect')
	.data(dataset)
	.enter()
	.append('rect')
	.attr('x', function(d, i) {
		return xScale(i);
	})
	.attr('y', function(d) {
		return h - yScale(d);
	})
	.attr('width', xScale.bandwidth())
	.attr('height', function(d) {
		return yScale(d);
	})
	.attr('fill', function(d) {
		return 'rgb(0, 0, ' + Math.round(d * 10) + ')';
	})
	.on('mouseover', function(d) {
		//Get this bar's x/y values, then augment for the tooltip
		var xPosition =
			parseFloat(d3.select(this).attr('x')) + xScale.bandwidth() / 2;
		var yPosition = parseFloat(d3.select(this).attr('y')) + 14;

		//Create the tooltip label
		svg
			.append('text')
			.attr('id', 'tooltip')
			.attr('x', xPosition)
			.attr('y', yPosition)
			.attr('text-anchor', 'middle')
			.attr('font-family', 'sans-serif')
			.attr('font-size', '11px')
			.attr('font-weight', 'bold')
			.attr('fill', 'black')
			.text(d);
	})
	.on('mouseout', function() {
		//Remove the tooltip
		d3.select('#tooltip').remove();
	});
// .on('click', function() {
// 	sortBars();
// });

//Define sort order flag
var sortOrder = false;

//Define sort function
var sortBars = function() {
	//Flip value of sortOrder
	sortOrder = !sortOrder;

	svg
		.selectAll('rect')
		.sort(function(a, b) {
			if (sortOrder) {
				return d3.ascending(a, b);
			} else {
				return d3.descending(a, b);
			}
		})
		.transition()
		.delay(function(d, i) {
			return i * 50;
		})
		.duration(1000)
		.attr('x', function(d, i) {
			return xScale(i);
		});
};
