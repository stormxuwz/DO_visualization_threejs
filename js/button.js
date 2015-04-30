$('#time_pick').appendDtpicker({
			"minuteInterval": 10,
			"closeOnSelected": true,
			"todayButton": false,
			"autodateOnStart": true,
			"current": "2014-7-4 12:30"
		});


$('#start_time').appendDtpicker({
			"minuteInterval": 10,
			"closeOnSelected": true,
			"todayButton": false,
			"autodateOnStart": true,
			"current": "2014-7-4 12:30"
		});

$('#end_time').appendDtpicker({
			"minuteInterval": 10,
			"closeOnSelected": true,
			"todayButton": false,
			"autodateOnStart": true,
			"current": "2014-7-5 12:30"
		});


	$("#Plot").on('click',function(){
		var timeString=$("#time_pick").val();
		if(timeString===""){
			return;
		}
		else{
			console.log(timeString);
			var time=new Date(timeString);
			changeData(time,300);
		}
	});	

	$("#Plot_10").on('click',function(){
		var timeString=$("#time_pick").val();

		if(timeString===""){
			return;
		}
		else{
			// console.log(timeString);
			var time=new Date(timeString);
			// time=time+10*60*1000;
			time.setMinutes(time.getMinutes()+10);
			console.log(time);
			$("#time_pick").handleDtpicker('setDate', time);
			// $("#time_pick").val(time)
			changeData(time,300);
		}
	});

	$("#Plot_hour").on('click',function(){
		var timeString=$("#time_pick").val();

		if(timeString===""){
			return;
		}
		else{
			// console.log(timeString);
			var time=new Date(timeString);
			// time=time+10*60*1000;
			time.setHours(time.getHours()+1);
			console.log(time);
			$("#time_pick").handleDtpicker('setDate', time);
			changeData(time,300);
		}
	});

	$("#Plot_day").on('click',function(){
		var timeString=$("#time_pick").val();

		if(timeString===""){
			return;
		}
		else{
			// console.log(timeString);
			var time=new Date(timeString);
			// time=time+10*60*1000;
			time.setDate(time.getDate()+1);
			console.log(time);
			$("#time_pick").handleDtpicker('setDate', time);
			changeData(time,300);
		}
	});

	$("#Plot_month").on('click',function(){
		var timeString=$("#time_pick").val();

		if(timeString===""){
			return;
		}
		else{
			// console.log(timeString);
			var time=new Date(timeString);
			// time=time+10*60*1000;
			time.setMonth(time.getMonth()+1);
			console.log(time);
			$("#time_pick").handleDtpicker('setDate', time);
			changeData(time,300);
		}
	});


	$("#Plot_movie").on('click',function(){
		var timeString=$("#time_pick").val();

		if(timeString===""){
			return;
		}
		else{
			var time=new Date(timeString);
			for(var i=0;i<1000;i++){
				time.setMinutes(time.getMinutes()+10);
				console.log(time);
				$("#time_pick").handleDtpicker('setDate', time);

				setTimeout( function() {
					changeData(time,100);
				},1000)
			}
		
		}
	});