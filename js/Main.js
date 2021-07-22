
function paintMain(main)
{
	if(main)
				{
					forEachClassName("citytitle", i => i.textContent= main.cityName);
					forEachClassName("maintitle", i => i.textContent= main.title);
					forEachClassName("custom-logo", i => i.setAttribute('src', main.logoUrl));
					
				$('#countStreettext').text(' - ' + main.streetCount);
				
				$('#countAddresstext').text(' - ' + main.addressCount);
				$('#countSecondaryAddresstext').text(' - ' + main.secondaryAddressCount);
				
				$('#countStreet').prop('max', getmaxcount(main.streetCount, 5000));
				$('#countAddress').prop('max', getmaxcount(main.addressCount, 20000));
				$('#countSecondaryAddress').prop('max', getmaxcount(main.secondaryAddressCount, 200000));
				
				$('#countStreet').val(main.streetCount);
				$('#countAddress').val(main.addressCount);
				$('#countSecondaryAddress').val(main.secondaryAddressCount);
				}
}
function getmaxcount(value, step)
{
	let i = value;
	for(i; i <= value ; i+= step)
	{
	}
	return i;
}