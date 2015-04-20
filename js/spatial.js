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
	"10523436":[-81.94116,41.78723],
	"10528849":[-82.03809,41.96542],
	"10528846":[-81.10453,42.25019],
	"10523443":[-81.66876,42.27996],
	"10523437":[-81.48266,41.93396],
	"10523445":[-81.24771,42.11404],
	"10384436":[-80.75237,41.99425],
	"10384448":[-80.77061,42.02799],
	"10384445":[-81.84190,41.63270],
	"10384437":[-81.79050,41.58760],
	"10384438":[-80.99845,41.88093],
	"10384443":[-81.49563,41.69570],
	"10384449":[-82.41187,41.91914],
	"10461951":[-82.28241,42.09275],
	"10384439":[-82.10502,42.21203]
}

var station_entries=d3.entries(station_position);

var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "20")
	.style("visibility", "hidden")
	.text("a simple tooltip");

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
		          .data(station_entries)
		          .each(transform) // update existing markers
		        .enter().append("svg:svg")
		          .each(transform)
		          .attr("class", "marker")
		         

		      marker.append("svg:circle")
		          .attr("r", 12)
		          .attr("cx", padding)
		          .attr("cy", padding)
		          .on('mouseover', function(){}) // Change event function
				  .on('mouseout', function(){}) // Change event function
		          // .append("svg:title")
		          // .text(function(d) {return "d"});
		          // .text(function(d) { return d.x; });

		      marker.append("svg:text")
		          .attr("x", padding + 15)
		          .attr("y", padding)
		          .attr("dy", ".31em")
		          .text(function(d) {return d.key; });
	          
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
	var circles=d3.select(overlay.getPanes().overlayMouseTarget)
	.selectAll("circle");

	var diffTime=time-initialTime;
	if(diffTime<0){
		console.log("diffTime<0");
		circles.style("fill","white");
		return;
	}

	var row_index=diffTime/(60*10*1000);
	// var row_index=
	// var dummyData=[20,9,11,8];
	console.log(diffTime)
	console.log(row_index);
	var newData=[];
	
	for(var i=0;i<station_entries.length;i++){
		newData.push(DO_data["logger_"+station_entries[i].key][row_index]);
	}

	circles.data(newData)
	.transition()
	.duration(transtion_time)
	// .attr("r",function(d){return d+1;})
	.style("fill",function(d) {return scale(d).toString()})
	
	circles
	.on("mouseover", function(d){
		return tooltip.text(String(d.toFixed(2))).style("visibility", "visible");
	})
	.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	.on("mouseout", function(){return tooltip.style("visibility", "hidden");})
	.on("click", function(d,i){
		// Function to show the time series
		circles.style("stroke","black").style("stroke-width","1.5px");
		d3.select(this).style("stroke","red").style("stroke-width","3px");
		// return tooltip.style("visibility", "hidden");
		showTimeSeries(station_entries[i].key)
	});

	// circles.selectAll("title")
	// .text(function(d) {return d});
	// setTimeout(function(){},transtion_time);
}


function showTimeSeries(stationName){
	
	console.log(stationName);
}


$(document).ready(function(){
	d3.json("test.json",function(data){
		DO_data=data;
		initialTime=new Date(DO_data["Time"][0]*1000);
		init();
	});

});
