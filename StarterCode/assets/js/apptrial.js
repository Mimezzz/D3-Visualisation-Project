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
  
  
  // function used for updating xAxis var upon click on axis label
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  };
  
  
  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale,chosenXAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
      
  
    return circlesGroup;
  };
  
  function renderLabels(circlesGroup, newXScale,chosenXAxis)
  
  function updateToolTip(chosenXAxis, circlesGroup) {
    // Conditional for X Axis.
    var xlabel;
  
    if (chosenXAxis === "healthcare") {
        var xlabel = "Healthcare rate: ";
    } 
    else {
        var xlabel = "Age: "
    };

    var toolTip = d3.tip()
    .attr('class','tooltip')
    .offset([60,40])
    .html((d)=> {
        return (`${d.state}<br>${xlabel}${d[chosenXAxis]}% <br> Age: ${d.age}`);
    });
    
  
    circlesGroup
      .on("mouseover", function(data) {
          toolTip.show(data);
      })

      .on("mouseout", function(data) {
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
            d.state= +d.state
          });
  
          // xLinearScale function above data
          var xLinearScale = xScale(data, chosenXAxis);
  
          // Create y scale function
          var yLinearScale = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.age)])
            .range([height, 0]);
  
          // Create initial axis functions
          var bottomAxis = d3.axisBottom(xLinearScale);
          var leftAxis = d3.axisLeft(yLinearScale);
  
          // append x axis
          var xAxis = scattergroup.append("g")
          .classed("x-axis", true)
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);
  
          // append y axis
          scattergroup.append('g')
          .call(leftAxis);
  
          // append initial circles
          var circlesGroup = scattergroup.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", d => xLinearScale(d[chosenXAxis]))
          .attr("cy", d => yLinearScale(d.age))
          .attr("r", 12)
          .attr("fill", "pink")
          .attr("opacity", ".5")
          
          var circletext= scattergroup.selectAll(null)
          .data(data)
          .enter()
          .append('text')
          .attr("x", d => xLinearScale(d[chosenXAxis]))
          .attr("y", d => yLinearScale(d.age))
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

            var povertylabel=labelsGroupx.append('text')
            .attr('x',0)
            .attr('y',60)
            .attr('value','poverty')
            .classed('inactive',true)
            .text('Poverty Rate(%)');
  
        // append y axis
  
            var labelsGroupy=scattergroup.append('g')
            .attr("transform", "rotate(-90)")
            .attr('y',0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy','1em')
            .attr("value", "age")
            .classed('axis-text',true)
            .text('Age');
  
            var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
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
            
              circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
  
              circletext = renderLabels(circleLabels, xLinearScale, chosenXAxis);
  
              circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
            
            if (chosenXAxis === "healthcare") {
              healthcarelabel
                .classed("active", true)
                .classed("inactive", false);
              smokerslabel
                .classed("active", false)
                .classed("inactive", true);
              povertylabel
              .classed("active", false)
              .classed("inactive", true);
            }
          
            else if (chosenXAxis === "smokes") {
                healthcarelabel
                  .classed("active", false)
                  .classed("inactive", true);
                smokerslabel
                  .classed("active", true)
                  .classed("inactive", false);
                povertylabel
                  .classed("active", false)
                  .classed("inactive", true);
              }

            else {
              healthcarelabel
                .classed("active", false)
                .classed("inactive", true);
              smokerslabel
                .classed("active", false)
                .classed("inactive", true);
              povertylabel
                .classed("active", true)
                .classed("inactive", false)
            };
          };
        });
            
           
  
      });
    };
  
  
  makeResponsive();
  d3.select(window).on("resize", makeResponsive);