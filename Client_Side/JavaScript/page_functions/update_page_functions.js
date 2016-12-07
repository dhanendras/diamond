var selRw;
$(document).ready(function(){
	loadLogo(pgNm);
	
	$("#cclPg").click(function(){
		window.location.href = "index.html";
	})

	$(document).on('click', '.userHldr', function(){	
		$('.foundCars').remove();
		$('#loaderMessages').html('0 assets')
		$('#loader').show();
		$('#fade').show();		
		loadUpdateAssets()
	});

})

function showEditTbl(el)
{
	$('#chooseOptTbl').fadeIn(1000);
	$('#fade').fadeIn(1000);
	$('#v5cID').val($(el).parent().parent().find('.diamondID').html());
	if($(el).siblings('.diamondClarity').html() != '&lt;<i>VIN</i>&gt;')
	{
		$('#vin').prop('readonly', true);
		$('#vin').css('cursor', 'not-allowed');
	}
	else
	{
		$('#vin').prop('readonly', false);
		$('#vin').css('cursor', 'text');
	}
	var clarity = $(el).siblings('.diamondClarity').html()
	if(clarity == '&lt;<i>clarity</i>&gt;')
	{
		clarity = 0;
	}
	var cut = $(el).siblings('.diamondCut').html()
	if(cut == '&lt;<i>cut</i>&gt;')
	{
		cut = 'undefined'
	}
	var diamondat = $(el).siblings('.diamonddiamondat').html()
	if(diamondat == '&lt;<i>diamondat</i>&gt;')
	{
		diamondat = 'undefined'
	}
	var colour = $(el).siblings('.diamondColour').html()
	if(colour == '&lt;<i>colour</i>&gt;')
	{
		colour = 'undefined'
	}
	var date = $(el).siblings('.diamondDate').html()
	if( date== '&lt;<i>date</i>&gt;')
	{
		date = 'undefined'
	}
     var time_stamp  = $(el).siblings('.diamondTime_stamp ').html()
	if( time_stamp == '&lt;<i>time_stamp </i>&gt;')
	{
		time_stamp = 'undefined'
	}
      var location = $(el).siblings('.diamondLocation').html()
	if( location== '&lt;<i>location</i>&gt;')
	{
		location = 'undefined'
	}
     var polish = $(el).siblings('.diamondPolish).html()
	if(polish == '&lt;<i>polish</i>&gt;')
	{
		polish = 'undefined'
	}
      var symmetry = $(el).siblings('.diamondSymmetry').html()
	if( symmetry== '&lt;<i>symmetry</i>&gt;')
	{
		symmetry = 'undefined'
	}
      var jewellery_type = $(el).siblings('.diamondJewellery_type ').html()
	if( jewellery_type == '&lt;<i>jewellery_type </i>&gt;')
	{
		jewellery_type = 'undefined'
	}



	$('#clarity').val(clarity);
	$('#cut').val(cut);
	$('#diamondat').val(diamondat);
	$('#colour').val(colour);
     $('#date').val(date);
	$('#time_stamp').val(time_stamp);
	$('#location').val(location);
	$('#symmetry').val(symmetry);
     $('#polish').val(polish);
	$('#jewellery_type').val(jewellery_type);
	
	
	$('#hidClarity').val(clarity);
	$('#hidCut').val(cut);
	$('#hidDiamondat').val(diamondat);
	$('#hidColour').val(colour);
	$('#hidDate').val(date);
      $('#hidTime_stamp').val(time_stamp);
	$('#hidLocation').val(location);
	$('#hidSymmetry').val(symmetry);
	$('#hidPolish').val(polish);
	$('#hidJewellery_type').val(jewellery_type);
}

}

function closeEditTbl()
{
	$('#chooseOptTbl').hide();
	$('#errorRw').hide();
	$('#fade').hide();
}

function validate(el)
{
	
	/*
	Validation on if details have been filled in for updating a car. This is not validation on what the person is allowed to update,
	that is done within the contract on the blockchain.
	*/
	
	$('#errorRw').html('<ul></ul>');
	var failed = false;
	if(isNaN(parseInt($('#vin').val().trim())))
	{
		$('#errorRw').find('ul').append('<li>VIN must be a number</li>')
		failed = true;
	}
	if($('#vin').val().trim().length != 15 && $('#vin').val().trim() != 0)
	{
		
		$('#errorRw').find('ul').append('<li>VIN must be 15 characters (Currently ' + $('#vin').val().trim().length + ' characters)</li>')
		failed = true;
	}
	if($('#vin').val().trim() == 0 && $('#hidVin').val().trim() != 0)
	{
		$('#errorRw').find('ul').append('<li>VIN cannot be reset to 0</li>')
		failed = true;
	}
	if($('#make').val().trim() == '')
	{
		$('#errorRw').find('ul').append('<li>Make cannot be blank</li>')
		failed = true;
	}
	if($('#make').val().trim().toLowerCase() == 'undefined' && $('#hidMake').val().trim().toLowerCase() != 'undefined')
	{
		$('#errorRw').find('ul').append('<li>Make cannot be reset to undefined</li>')
		failed = true;
	}
	if($('#model').val().trim() == '')
	{
		$('#errorRw').find('ul').append('<li>Model cannot be blank</li>')
		failed = true;
	}
	if($('#model').val().trim().toLowerCase() == 'undefined' && $('#hidModel').val().trim().toLowerCase() != 'undefined')
	{
		$('#errorRw').find('ul').append('<li>Model cannot be reset to undefined</li>')
		failed = true;
	}
	if($('#colour').val().trim() == '')
	{
		$('#errorRw').find('ul').append('<li>Colour cannot be blank</li>')
		failed = true;
	}
	if($('#colour').val().trim().toLowerCase() == 'undefined' && $('#hidColour').val().trim().toLowerCase() != 'undefined')
	{
		$('#errorRw').find('ul').append('<li>Colour cannot be reset to undefined</li>')
		failed = true;
	}
	if($('#reg').val().trim() == '')
	{
		$('#errorRw').find('ul').append('<li>Registration cannot be blank</li>')
		failed = true;
	}
	if($('#reg').val().trim().toLowerCase() == 'undefined' && $('#hidReg').val().trim().toLowerCase() != 'undefined')
	{
		$('#errorRw').find('ul').append('<li>Registration cannot be reset to undefined</li>')
		failed = true;
	}
	if(!failed)
	{
		$('#errorRw').hide();
		updateAsset($('#clarity').val().trim(), $('#cut').val().trim(), $('#diamondat').val().trim(), $('#colour').val().trim(), $('#date').val().trim(), $('#time_stamp').val().trim(), $('#location').val().trim(), $('#symmetry').val().trim(),$('#polish').val().trim(),
 $('#symmetry').val().trim(), $('#jewellery_type').val().trim(),  $('#v5cID').val(), el)
	}
	else
	{
		$('#errorRw').show();
	}
}
