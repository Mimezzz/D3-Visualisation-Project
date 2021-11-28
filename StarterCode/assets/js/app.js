// @TODO: YOUR CODE HERE!
var svgHeight = window.innerHeight/1.5;
var svgWidth = window.innerWidth/1.2;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var scattergroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

//initial params
var chosenXAxis = "healthcare";
var chosenYAxis = 'poverty';

function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
};

function yScale(data,chosenYAxis){
  var yLinearScale= d3.scaleLinear()
  .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
  d3.max(data, d => d[chosenYAxis]) * 1.2
]).range([height,0]);

  return yLinearScale;
};

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
};

function renderYAxes(newYScale, yAxis){
  var leftAxis =d3.axisLeft(newYScale);

  yAxis.transition()
  .duration(1000)
  .call(leftAxis);

  return yAxis;
};

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale,newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr('cy', d => newYScale(d[chosenYAxis]));

  return circlesGroup;
};

//update text in circles
function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  circletextGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
  return circletextGroup;
};

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
  // Conditional for X Axis.
  if (chosenXAxis === "healthcare") {
      var xlabel = "Healthcare rate: ";
  } 
  else {
      var xlabel = "Age: "
  };
  // Conditional for Y Axis.
  if (chosenYAxis === "poverty") {
      var ylabel = "Poverty: ";
  } 
  else {
      var ylabel = "smokes: "
  }

  var toolTip = d3.tip()
  .offset([120, -60])
  .attr("class", "d3-tip")
  .html(function(d) {
          return (`${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}`);
          });
circlesGroup.call(toolTip);

circlesGroup
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    textGroup
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    return circlesGroup;};


//import data
d3.csv('assets/data/data.csv').then((data) =>{
  console.log(data);

//parse data
  data.forEach((data)=>{
    data.healthcare= +data.healthcare;
    data.poverty= +data.poverty;
    data.smokes= +data.smokes;
    data.age= +data.age;
  });

// xLinearScale function above data
var xLinearScale = xScale(data, chosenXAxis);

// Create y scale function
var yLinearScale = yScale(data,chosenYAxis);

// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
var xAxis = scattergroup.append("g")
.classed("x_axis", true)
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

// append y axis
var yAxis =scattergroup.append('g')
.call(leftAxis);

// append initial circles
var circlesGroup = scattergroup.selectAll("circle")
.data(data)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d[chosenXAxis]))
.attr("cy", d => yLinearScale(d[chosenYAxis]))
.attr("r", 20)
.attr("fill", "pink")
.attr("opacity", ".5");

create circle text
var circleText=scattergroup.append('text')
.attr("x", d => xLinearScale(d[chosenXAxis]))
.attr("y", d => yLinearScale(d[chosenYAxis]))
.attr("dy", ".35em") 
.text(d=>d.abbr);
           

// Create group for two x_axis labels
var labelsGroupx = scattergroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + 20})`);

var healthcarelabel= labelsGroupx.append('text')
  .attr('x',0)
  .attr('y',20)
  .attr('value','healthcare')
  .classed('active',true)
  .text('Healthcare Rate(%)');

var smokerslabel=labelsGroupx.append('text')
.attr('x',0)
.attr('y',40)
.attr('value','smokes')
.classed('inactive',true)
.text('Smokers(%)');

// append y axis

var labelsGroupy=scattergroup.append('text')
.attr("transform", "rotate(-90)");

var povertylabel=labelsGroupy.append('text')
.attr('x',0 - (height / 2))
.attr('y', 20 - margin.left)
.attr('dy','1em')
.attr("value", "poverty")
.classed('active',true)
.text('Poverty(%)');

var agelabel=labelsGroupy.append('text')
.attr('x',0 - (height / 2))
.attr('y', 0 - margin.left)
.attr('dy','1em')
.attr("value", "age")
.classed('inactive',true)
.text('Age');



// x axis labels event listener
labelsGroupx.selectAll("text")
.on("click", function() {

  // get value of selection
    chosenXAxis = d3.select(this).attr("value");
    // replaces chosenXAxis with value
      console.log(chosenXAxis);
      xLinearScale = xScale(data, chosenXAxis);
    // updates x axis with transition
      xAxis = renderXAxes(xLinearScale, xAxis);

    if (chosenXAxis === "healthcare") {
      healthcarelabel
        .classed("active", true)
        .classed("inactive", false);
      smokerslabel
        .classed("active", false)
        .classed("inactive", true);
    }

    else {
      healthcarelabel
        .classed("active", false)
        .classed("inactive", true);
      smokerslabel
        .classed("active", true)
        .classed("inactive", false);
    };
    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis,chosenYAxis);

    // updates tooltips with new info
        
    circlesGroup=updateToolTip(chosenXAxis, chosenYAxis, circlesGroup,circle, circleText);});


    //y axis labels even listener
    labelsGroupy.selectAll('text')
      .on('click',function(){
          chosenYAxis=d3.select(this).attr('value');
            console.log(chosenYAxis);
            yLinearScale=yScale(data,chosenYAxis);
            yAxis=renderYAxes(yLinearScale,yAxis);

          if (chosenYAxis === "poverty") {
            povertylabel
              .classed("active", true)
              .classed("inactive", false);
              agelabel
              .classed("active", false)
              .classed("inactive", true);
          }
      
          else {
            povertylabel
              .classed("active", false)
              .classed("inactive", true);
              agelabel
              .classed("active", true)
              .classed("inactive", false);
          };
        
        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis,chosenYAxis);

         // updates tooltips with new info

        circleText = renderText(circleText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        
        circlesGroup=updateToolTip(chosenXAxis, chosenYAxis, circlesGroup,circle, circleText);});

});

