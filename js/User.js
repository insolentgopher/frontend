CURRENTUSER = null;
MainURL = "http://10.0.16.13:2023/portal/api/v1/register/";


$(function () {
	getIam();
});


function notuser()
{
	CURRENTUSER == null;
		forEachClassName("superRootRole", i => i.parentNode.removeChild(i));
		forEachClassName("dictionaryRole", i => i.parentNode.removeChild(i));
		forEachClassName("auditRole", i => i.parentNode.removeChild(i));
		forEachClassName("userRole", i => i.parentNode.removeChild(i));
		forEachClassName("exportImportRole", i => i.parentNode.removeChild(i));
		forEachClassName("registryRole", i => i.parentNode.removeChild(i));
		forEachClassName("alluser", i => i.parentNode.removeChild(i));
	   $('#load').addClass("hide-loader");

}



async function getIam(){
	
	
	$('#load').removeClass("hide-loader");
	if(gettoken())
	{
	if(CURRENTUSER==null)
	{
	let u = await axios.get(MainURL + getCity()+'/login/current', {
				headers: {token: gettoken()}
			  }
			).then(response => {CURRENTUSER = response.data;}).catch(error => {
				if(error.response.data.errorCode=="INVALID_TOKEN")
				{
					notuser();
					//removetoken();
					//getIam();
				}
					else{
					GETERROR(error); 
					$('#load').addClass("hide-loader");}
					});
					
	}
	
	if(CURRENTUSER == null){
		forEachClassName("superRootRole", i => i.parentNode.removeChild(i));
		forEachClassName("dictionaryRole", i => i.parentNode.removeChild(i));
		forEachClassName("auditRole", i => i.parentNode.removeChild(i));
		forEachClassName("userRole", i => i.parentNode.removeChild(i));
		forEachClassName("exportImportRole", i => i.parentNode.removeChild(i));
		forEachClassName("registryRole", i => i.parentNode.removeChild(i));
		forEachClassName("alluser", i => i.parentNode.removeChild(i));
		
		return;
	}
	if(document.getElementById("iam"))
	document.getElementById("iam").setAttribute("uk-tooltip", CURRENTUSER.login);
	
	forEachClassName("user", i => i.parentNode.removeChild(i));
	
	if(+CURRENTUSER.superRootRole == 0)
	{
		forEachClassName("superRootRole", i => i.parentNode.removeChild(i));
		
		if(+CURRENTUSER.dictionaryRole == 0)
			forEachClassName("dictionaryRole", i => i.parentNode.removeChild(i));
		if(+CURRENTUSER.auditRole == 0)
			forEachClassName("auditRole", i => i.parentNode.removeChild(i));
		if(+CURRENTUSER.userRole == 0)
			forEachClassName("userRole", i => i.parentNode.removeChild(i));
		if(+CURRENTUSER.exportImportRole == 0)
			forEachClassName("exportImportRole", i => i.parentNode.removeChild(i));
		if(+CURRENTUSER.registryRole == 0)
			forEachClassName("registryRole", i => i.parentNode.removeChild(i));
	}
	
	$('body').removeClass('uk-invisible');
	}
	else
	{
		forEachClassName("superRootRole", i => i.parentNode.removeChild(i));
		forEachClassName("dictionaryRole", i => i.parentNode.removeChild(i));
		forEachClassName("auditRole", i => i.parentNode.removeChild(i));
		forEachClassName("userRole", i => i.parentNode.removeChild(i));
		forEachClassName("exportImportRole", i => i.parentNode.removeChild(i));
		forEachClassName("registryRole", i => i.parentNode.removeChild(i));
		
		forEachClassName("alluser", i => i.parentNode.removeChild(i));
	}
	
	$('#load').addClass("hide-loader");
	
	
}
async function visView(roles){
	if(gettoken())
	{
	if(CURRENTUSER==null)
	{
		let u = await axios.get(MainURL + getCity()+'/login/current', {
				headers: {token: gettoken()}
			  }
			).then(response => {CURRENTUSER = response.data;}).catch(error => {
				if(error.response.data.errorCode=="INVALID_TOKEN")
				{
					//removetoken();
					//visView();
					$(location).attr('href','login.html');
				}
					else{
					GETERROR(error); 
					$('#load').addClass("hide-loader");}
					});
	}
	
	if(CURRENTUSER)
	{
		let i = 0;
		
		roles.forEach(item=> {
			if(+CURRENTUSER[item]==1){
				i = 1;
			}
		});
		if(i==0){
			$('body').empty();
			UIkit.notification({ message: 'Обмежені права на перегляд цієї сторінки', status: 'danger' });
			return false;
		}
		else
		{
			return true;
		}
	}
	else
	{
		$(location).attr('href','login.html');
	}
	}
	else{
		$(location).attr('href','login.html');
	}

}

async function removeelement(roles, classname){
	if(gettoken())
	{
	if(CURRENTUSER==null)
	{
		let u = await axios.get(MainURL + getCity()+'/login/current', {
				headers: {token: gettoken()}
			  }
			).then(response => {CURRENTUSER = response.data;}).catch(error => {
				if(error.response.data.errorCode=="INVALID_TOKEN")
				{
					//removetoken();
					//viselement();
					forEachClassName(classname, i => i.parentNode.removeChild(i));
				}
					else{
					GETERROR(error); 
					$('#load').addClass("hide-loader");}
					});
	}
	if(CURRENTUSER)
	{
		let i = 0;
		roles.forEach(item=> {
			if(+CURRENTUSER[item]==1){
				i = 1;
			}
		});
		if(i==0){
			forEachClassName(classname, i => i.parentNode.removeChild(i));
		}
		
	}
	else
		forEachClassName(classname, i => i.parentNode.removeChild(i));
	}
	else
		forEachClassName(classname, i => i.parentNode.removeChild(i));
}
async function viselement(roles, element){
	if(gettoken())
	{
	if(CURRENTUSER==null)
	{
		let u = await axios.get(MainURL + getCity()+'/login/current', {
				headers: {token: gettoken()}
			  }
			).then(response => {CURRENTUSER = response.data;}).catch(error => {
				if(error.response.data.errorCode=="INVALID_TOKEN")
				{
					//removetoken();
					//viselement();
					return;
				}
					else{
					GETERROR(error); 
					$('#load').addClass("hide-loader");}
					});
	}
	if(CURRENTUSER)
	{
		let i = 0;
		roles.forEach(item=> {
			if(+CURRENTUSER[item]==1){
				i = 1;
			}
		});
		if(i==0){
			return;
		}
		else
		{
			return element;
		}
	}
	else
		return;
	}
	else
		return;
}
