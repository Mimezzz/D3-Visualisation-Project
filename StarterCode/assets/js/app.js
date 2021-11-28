// @TODO: YOUR CODE HERE!

function makeResponsive() {

  var svgArea = d3.select("body").select("svg");
    
      // clear svg is not empty
      if (!svgArea.empty()) {
        svgArea.remove();
      }
    
      var svgHeight = window.innerHeight/1.7;
        var svgWidth = window.innerWidth/1.5;
    
      var margin = {
        top: 20,
        right: 40,
        bottom: 80,
        left: 100
      };
    
      var height = svgHeight - margin.top - margin.bottom;
      var width = svgWidth - margin.left - margin.right;
    
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

  //define all functions first

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
function renderCircles(circlesGroup, newXScale,chosenXAxis,newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
};

function renderLabels(circleLabels, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circleLabels.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));

  return circleLabels;
};

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  // Conditional for X Axis.
  var xlabel;

  if (chosenXAxis === "healthcare") {
      var xlabel = "Healthcare rate: ";
  } 
  else {
      var xlabel = "Age: "
  };
  // Conditional for Y Axis.
  var ylabel;

  if (chosenYAxis === "poverty") {
      var ylabel = "Poverty: ";
  } 
  else {
      var ylabel = "Smokes: "
  }

  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -80])
  .html(function (d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
  });

circlesGroup.call(toolTip);

circlesGroup.on("mouseover", function (data) {
  toolTip.show(data, this);
})
  // onmouseout event
  .on("mouseout", function (data) {
      toolTip.hide(data);
  });

    return circlesGroup;
};

      
    //import data
      d3.csv('assets/data/data.csv').then((data) =>{
        console.log(data);

      //parse data
        data.forEach((d)=>{
          d.healthcare= +d.healthcare;
          d.poverty= +d.poverty;
          d.smokes= +d.smokes;
          d.age= +d.age;
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
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

        // append y axis
        var yAxis =scattergroup.append('g')
        .classed("y-axis", true)
        .call(leftAxis);

        // append initial circles
        var circlesGroup = scattergroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 12)
        .attr("fill", "pink")
        .attr("opacity", ".5")
        
        var circletext= scattergroup.selectAll(null)
        .data(data)
        .enter()
        .append('text')
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", ".35em") 
        .text(d=>d.abbr)
        .style('fill','black')
        .style("font-size", "10px")
        .style("text-anchor", "middle");


        // Create group for two x_axis labels
        var labelsGroupx = scattergroup.append("g")
        .attr("transform", `translate(${width/2}, ${height + 20})`);

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

          var labelsGroupy=scattergroup.append('g')
          .attr("transform", "rotate(-90)");

          var povertylabel=labelsGroupy.append('text')
          .attr('y',0 - margin.left)
          .attr('x', 0 - (height / 2))
          .attr('dy','1em')
          .attr("value", "poverty")
          .classed('active',true)
          .text('Poverty(%)');

          var agelabel=labelsGroupy.append('text')
          .attr('y',0 - margin.left + 20)
          .attr('x', 0 - (height / 2))
          .attr('dy','1em')
          .attr("value", "age")
          .classed('inactive',true)
          .text('Age');

          var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // x axis labels event listener
      labelsGroupx.selectAll("text")
      .on("click", function() {

          var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;
            console.log(chosenXAxis);
            
            xLinearScale = xScale(data, chosenXAxis);
          // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);
          
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            circletext = renderLabels(circleLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
          
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
        };
      });
          
          //y axis labels even listener
          labelsGroupy.selectAll('text')
            .on('click',function(){
              var value = d3.select(this).attr("value");
                if (value !== chosenYAxis) {
  
                  // replaces chosenYAxis with value
                  chosenYAxis = value;
                  console.log(chosenYAxis);
                  yLinearScale=yScale(data,chosenYAxis);
                  yAxis=renderYAxes(yLinearScale,yAxis);

                  circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                  circletext = renderLabels(circleLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
      
                  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


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
      };

    });
  });
};

makeResponsive();
d3.select(window).on("resize", makeResponsive);
