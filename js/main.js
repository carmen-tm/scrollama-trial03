// using d3 for convenience
var main = d3.select('main');
var scrolly = main.select('#scroll');
var chart = scrolly.select('.chart'); // TO DO: mejorar esto
var article = scrolly.select('.scroll__text'); // same
var step = article.selectAll('.step');
// initialize the scrollama
var scroller = scrollama();
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
// scrollama event handlers
function handleStepEnter(response) {
	console.log(response);
	// response = { element, direction, index }
	// add color to current step only
	step.classed('is-active', function(d, i) {
		return i === response.index;
	});
	// update graphic based on step
	chart.select('p').text(response.index + 1);
}
function setupStickyfill() {
	d3.selectAll('.sticky').each(function() {
		Stickyfill.add(this);
	});
}
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
