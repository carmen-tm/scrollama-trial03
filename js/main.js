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
	}
	if (response.index === 1) {
		chartContent.select('p').text('soy el segundo step');
	}
	if (response.index === 2) {
		chartContent.select('p').text('soy el tercer step');
	}
	if (response.index === 3) {
		chartContent.select('p').text('soy el cuarto step');
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
			step: '#scroll .scroll__text .step',
			offset: 0.5,
			debug: false
		})
		.onStepEnter(handleStepEnter);
	// setup resize event
	window.addEventListener('resize', handleResize);
}
// kick things off
init();
