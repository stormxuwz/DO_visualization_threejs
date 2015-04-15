var DO_data;
var map;
var overlay;
var initialTime;
var scale = chroma.scale(['red', 'yellow', 'blue']).domain([0, 12]);

var station_position={
	"10523446":[-81.20418,42.42676],
	"10523447":[-81.75660,41.97501],
	"10523439":[-81.01057,42.07898],
	"10523450":[-81.57354,42.10761],
	"10523446":[-81.20418,42.42676],
}

function init(){
	// Create Map
	map = new google.maps.Map(d3.select("#map").node(), {
		zoom: 9,
		center: new google.maps.LatLng(42.054393, -81.386539),  
		mapTypeId: google.maps.MapTypeId.TERRAIN
	});
	
	overlay = new google.maps.OverlayView();

	overlay.onAdd = function() {
		layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
	        .attr("class", "stations");

	    overlay.draw = function() {
		      var projection = this.getProjection(),
		          padding =20;

		      var marker = layer.selectAll("svg")
		          .data(d3.entries(station_position))
		          .each(transform) // update existing markers
		        .enter().append("svg:svg")
		          .each(transform)
		          .attr("class", "marker")
		         

		      marker.append("svg:circle")
		          .attr("r", 12)
		          .attr("cx", padding)
		          .attr("cy", padding)
		          .on('mouseover', function(){console.log("hi");}) // Change event function
				  .on('mouseout', function(){d3.select(this).style("fill", "white");}) // Change event function
		          

		      marker.append("svg:text")
		          .attr("x", padding + 7)
		          .attr("y", padding)
		          .attr("dy", ".31em")
		          .text(function() {return "names"; });
	          
		      function transform(d) {
		        d = new google.maps.LatLng(d.value[1], d.value[0]);
		        d = projection.fromLatLngToDivPixel(d);
		        // console.log(d.y);
		        return d3.select(this)
		            .style("left", (d.x - padding) + "px")
		            .style("top", (d.y - padding) + "px");
		      }
	   	};
	}
	overlay.setMap(map);
	console.log("map finished");
}


function changeData(time,transtion_time) {
	var diffTime=time-initialTime;
	if(diffTime<0){
		console.log("diffTime<0");
		return;
	}

	var row_index=diffTime/(60*10*1000);
	// var dummyData=[20,9,11,8];
	console.log(diffTime)
	console.log(row_index);
	var newData=[];
	for(var p in station_position){
		// console.log(p);
		newData.push(DO_data["logger_"+p][row_index]);
	}

	console.log(newData);

	d3.select(overlay.getPanes().overlayMouseTarget)
	.selectAll("circle")
	.data(newData)
	.transition()
	.duration(transtion_time)
	// .attr("r",function(d){return d*1.5;})
	.style("fill",function(d) {return scale(d).toString()});
	setTimeout(function(){},transtion_time);
}



$(document).ready(function(){
	d3.json("test.json",function(data){
		DO_data=data;
		initialTime=new Date(DO_data["Time"][0]*1000);
		init();
	});

});
