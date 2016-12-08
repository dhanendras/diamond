function loadAssets()
{
	/*
	Retrieves all assetIDs from the blockchain and formats the data to display on a web page. Need the address of the account 
	executing this request, at the moment this is hard coded in the html for each page. 
	*/
	var found = 0;
	var posLast = 0;
	var objects = [];
	var error = false;
	var xhr = new XMLHttpRequest()
	xhr.open("GET", "/blockchain/assets1/assets", true)
	xhr.overrideMimeType("text/plain");
	xhr.onprogress = function () {
		var data = xhr.responseText;
		var array = data.split("&&");
		
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].trim() != "")
			{
				var obj = JSON.parse(array[i]);
				var found = false;
				
				for(var j = 0; j < objects.length; j++)
				{
					if(objects[j].assetID == obj.assetID)
					{
						found = true;
						break;
					}
				}
				if(!found)
				{
					if(pgNm == "Miner")
					{
						if(obj.status == 0)
						{
							obj.clarity = '&lt;<i>clarity</i>&gt;';
							obj.cut = '&lt;<i>cut</i>&gt;';
							obj.diamondat = '&lt;<i>diamondat</i>&gt;';
							obj.colour = '&lt;<i>colour</i>&gt;';
date</i>&gt;';
location</i>&gt;';
symmetry</i>&gt;';
polish</i>&gt;';
time_stamp</i>&gt;';
jewellery_type</i>&gt;';

					           obj.date = '&lt;<i>
                                      obj.location = '&lt;<i> 
                                      obj.symmetry = '&lt;<i>
                                      obj.polish = '&lt;<i>
                                      obj.time_stamp = '&lt;<i>
                                      obj.jewellery_type ='&lt;<i>
							objects.push(obj);
						}
					}
					else
					{
						if(typeof obj.message == 'undefined' && obj.VIN > 0 && obj.make.toLowerCase() != 'undefined' && obj.make.trim() != '' && obj.model.toLowerCase() != 'undefined' && obj.model.trim() != '' && obj.reg.toLowerCase() != 'undefined' && obj.reg.trim() != '' && obj.colour.toLowerCase() != 'undefined' && obj.colour.trim() != '' && !obj.scrapped)
						{
							objects.push(obj)
						}
					}
					if(obj.hasOwnProperty("error"))
					{
						error = true
						$("#vhclsTbl").append("Unable to load assets.");
					}
				}
			}
		}
		var plu = 'assets';
		if(objects.length == 1)
		{
			plu = 'asset';
		}
		$('.numFound').html(objects.length + ' ' + plu);
	}
	xhr.onreadystatechange = function (){
		if(xhr.readyState === 4)
		{
			if(!error)
			{
				$("#vhclsTbl").empty();
				for(var i = 0; i < objects.length; i++)
				{
					var data = objects[i];
					$("#vhclsTbl").append("<tr class='assetRw'><td class='clarity'>"+data.clarity+"</td><td class='assetDets' ><span class='diamondInfo'>" + data.cut + "</span><span class='carInfo'>" + data.diamondat + ", </span><span class='diamondInfo'>" + data.time_stamp + ", </span><span class='diamondInfo'>" + data.jewellery_type + ", </span><span class='diamondInfo'>" + data.location + ", </span><span class='diamondInfo'>" + data.symmetry + ", </span><span class='diamondInfo'>" + data.polish + ", </span><span class='diamondInfo'>" + data.colour + ", </span><span class='diamondInfo'>" + data.date + "</span></td><td class='chkHldr'><span class='chkSpc' ></span><span class='chkBx' ></span><input class='isChk' type='hidden' value='false' /><input class='assetID' type='hidden' value='"+data.assetID+"' /></td></tr>");
				}
				changeBarSize();
			}
		}
	}
	xhr.send()
}

function loadUpdateAssets()
{
	/*
	Retrieves all V5Cs from the blockchain and formats the data to display on a web page. Need the address of the account 
	executing this request, at the moment this is hard coded in the html for each page. 
	*/
	var found = 0;
	var posLast = 0;
	var objects = [];
	var xhr = new XMLHttpRequest()
	xhr.open("GET", "/blockchain/assets/assets", true)
	xhr.overrideMimeType("text/plain");
	xhr.onprogress = function () {
		var data = xhr.responseText;
		var array = data.split("&&");
		
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].trim() != "")
			{
				var obj = JSON.parse(array[i]);
				var found = false;
				for(var j = 0; j < objects.length; j++)
				{
					if(objects[j].v5cID == obj.v5cID)
					{
						found = true;
						break;
					}
				}
				
				console.log("UPDATE ASSET READ:", obj)
				
				if(!found && typeof obj.message == 'undefined')
				{
					objects.push(obj)		
				}
			}
		}
		var plu = 'assets';
		if(objects.length == 1)
		{
			plu = 'asset';
		}
		$('#loaderMessages').html(objects.length + ' ' + plu);
	}
	xhr.onreadystatechange = function (){
		if(xhr.readyState === 4)
		{
			var d = objects;
			$('#loader').hide();
			$('#fade').hide();
			for(var i = 0; i < d.length; i++)
			{
				var data = d[i];
				if(data.clarity == 0) data.clarity = '&lt;<i>clarity</i>&gt;';
				if(data.cut.toLowerCase() == 'undefined' || data.cut.trim() == '') data.cut = '&lt;<i>cut</i>&gt;';
				if(data.diamondat.toLowerCase() == 'undefined' || data.diamondat.trim() == '') data.diamondat = '&lt;<i>diamondat</i>&gt;';
				if(data.date.toLowerCase() == 'undefined' || data.date.trim() == '') data.date = '&lt;<i>date</i>&gt;';
                      if(data.time_stamp.toLowerCase() == 'undefined' || data.time_stamp.trim() == '') data. time_stamp= '&lt;<i>time_stamp</i>&gt;';
                      if(data.location.toLowerCase() == 'undefined' || data.location.trim() == '') data.location = '&lt;<i>location</i>&gt;';
                      if(data.symmetry.toLowerCase() == 'undefined' || data.symmetry.trim() == '') data.symmetry = '&lt;<i>symmetry</i>&gt;';
                      if(data.polish.toLowerCase() == 'undefined' || data.polish.trim() == '') data.date = '&lt;<i>polish</i>&gt;';
                      if(data.jewellery_type.toLowerCase() == 'undefined' || data.jewellery_type.trim() == '') data.jewellery_type = '&lt;<i>polish</i>&gt;';
				if(data.colour.toLowerCase() == 'undefined' || data.colour.trim() == '') data.colour = '&lt;<i>colour</i>&gt;';
				$('<tr class="foundDiamonds" ><td class="smlBrk"></td><td class="editRw" ><span class="diamondID">'+data.assetID+'</span></td><td class="editRw" colspan="2" >[<span class="diamondClarity">'+data.clarity+'</span>] <span class="diamondCut">'+data.cut+'</span> <span class="diamondDiamondat">'+data.diamondat+'</span>, <span class="diamondColour">'+data.colour+'</span>, <span
class="diamondLocation">'+data.location+'</span>, <span
class="diamondSymmetry">'+data.symmetry+'</span>, <span 
class="diamondPolish">'+data.polish+'</span>, <span
class="diamondTime_stamp">'+data.time_stamp+'</span>, <span 
class="diamondJewellery_type">'+data.jewellery_type+'</span>, <span 
class="diamondDate">'+data.reg+'</span><img src="Icons/Distributor/edit.svg" onclick="showEditTbl(this)" class="rtBtn" width="20" height="20" /></td><td class="smlBrk" ></td></tr>').insertAfter('#insAft');
			}
		}
	}
	xhr.send()	
}
