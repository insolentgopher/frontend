
$(function () {
		if($(window).width()<=960)
		{
		 if (document.getElementById('left-col') !=null) 
			document.getElementById('left-col').toggleAttribute('hidden');
		}
		window.addEventListener("resize", () => {
		if($(window).width()>960)
		{
		if (document.getElementById('left-col') !=null) 
			document.getElementById('left-col').removeAttribute("hidden"); 
		}
		else{
			if (document.getElementById('left-col') !=null) 
			document.getElementById('left-col').setAttribute("hidden", true); 
		}
		});
});


function dis(value, div) {

             if (value) {
                 $('#' + div).removeClass('uk-disabled');
             }
        else {
            clearElement(div, true);
            $('#' + div + ' table').empty();
            $('#' + div).addClass('uk-disabled');
        }
    }
    function clearElement(div, dsabledBtns) {
        var selects = $('#' + div).find('select') || [],
            textinputs = $('#' + div).find('input[type="text"]') || [],
            numberinputs = $('#' + div).find('input[type="number"]') || [],
            buttons = dsabledBtns ? $('#' + div).find('button') : [],
            radio = $('#' + div).find('input[type="radio"]') || [],
            check = $('#' + div).find('input[type="checkbox"]') || [];

        // RADIO ---------------------------------------------------------
        function checkRadioGroupName(rgName, group) {
            var res = false;
            group.forEach(function (rgItem) {
                if (rgItem.name == rgName)
                    res = true;
            });
            return res;
        }

        function pushItemToGroupElements(item, group) {
            group.forEach(function (rgItem) {
                if (rgItem.name == item.name)
                    rgItem.elements.push(item);
            });
        }
		
		

        function pushNewGroup(element, group) {
            group.push({
                name: element.name,
                elements: [element]
            });
        }

        if (radio && radio.length > 0) {
            //???????????????? ???????????? ????????????
            var radioGroups = [];
            for (var i = 0; i < radio.length; i++) {
                //???????? ???????????? ?????????? ?????? ????????????, ???? ???????????? ?????????????????? ???????????? ?? ???????????? ?????????????? ??????????????
                if (radioGroups.length == 0)
                    pushNewGroup(radio[i],radioGroups);
                else {
                    //?????????????????? ???? ?????????????? ????????????
                    if (checkRadioGroupName(radio[i].name, radioGroups))
                        //?????????????????? ?????????????? ?? ???????????? ?????? ????????????
                        pushItemToGroupElements(radio[i], radioGroups);
                    else
                        //?????????????? ?????? ???????? ?????????????? ????????????
                        pushNewGroup(radio[i],radioGroups);
                }
            }
            //?????????????????????????????????????? ???????????? ????????????
            radioGroups.forEach(function (rgItem) {
                $(rgItem.elements).prop('checked', true).trigger('change');
            });
        }

        if (check && check.length > 0) {
            //???????????????? ???????????? ????????????
            var checkGroups = [];
            for (var i = 0; i < check.length; i++) {
                //???????? ???????????? ?????????? ?????? ????????????, ???? ???????????? ?????????????????? ???????????? ?? ???????????? ?????????????? ??????????????
                if (checkGroups.length == 0)
                    pushNewGroup(check[i],checkGroups);
                else {
                    //?????????????????? ???? ?????????????? ????????????
                    if (checkRadioGroupName(check[i].name, checkGroups))
                        //?????????????????? ?????????????? ?? ???????????? ?????? ????????????
                        pushItemToGroupElements(check[i], checkGroups);
                    else
                        //?????????????? ?????? ???????? ?????????????? ????????????
                        pushNewGroup(check[i],checkGroups);
                }
            }
            //?????????????????????????????????????? ???????????? ????????????
            checkGroups.forEach(function (rgItem) {
                $(rgItem.elements).prop('checked', false).trigger('change');
            });
        }

        //------------------------------------------------------

        if (selects && selects.length > 0)
            for (var i = 0; i < selects.length; i++) {
                //$(selects[i]).empty();
                //$(selects[i]).append($("</option>", { value: -1, text: "-" }));
                if (selects[i].className.indexOf("colorselect") != -1) {
                    $(selects[i]).prop("selectedIndex", 0).trigger('change');
                }
                else
                $(selects[i]).val(-1).trigger('change');
            }

        if (textinputs && textinputs.length > 0)
            for (var i = 0; i < textinputs.length; i++) {
                $(textinputs[i]).val("");
            }
        if (numberinputs && numberinputs.length > 0)
            for (var i = 0; i < numberinputs.length; i++) {
                $(numberinputs[i]).val(numberinputs[i].min);
            }
    }
        function Fixedprice(price, money) {
            return price.toFixed(2) + (money? ' ??????':'' );
        }
        function buttonconfirm(_title, _text, func) {

            Swal.fire({
                title: _title,
                text: _text,
                icon: 'warning',
                showCancelButton: true,
                //confirmButtonColor: '#DD6B55',
                //cancelButtonColor: '#DD6B55',
                confirmButtonText: '??????',
                cancelButtonText: "????",

            }).then((result) => {
                if (result.isConfirmed) {
                    if (func != null)
                        func();
                }
            })
        }
        function div(val, by) {
            return (val / by).toFixed(6) - (val / by).toFixed();
        }
        function validnumber(e) {
            var f = true;
            var x = parseFloat(e.value=="" ? 0 : e.value);
            e.value = x;
            if (x > parseFloat(e.max) && e.max != "") {
                f = false;
                e.value = e.max;
            }
            if (x < parseFloat(e.min) && e.min != "") {
                f = false;
                e.value = e.min;
            }
            if (div(parseFloat(e.value), parseFloat(e.step)) != 0 && e.step != '') {
                f = false;
                e.value = getClosestInteger(parseFloat(e.value), parseFloat(e.step));
            }
            if (!f) {
                UIkit.notification({ message: '?????????????? ???????????????? ??????????????????????, ???????? ???????????????? ???? ??????????????????', status: 'danger' });
            }
        }
        let getClosestInteger = (a, b, x = Math.trunc(a / b)) => { //?? - ?????????????? ?????? b ???????????????????? ?? ??
            if (a > b) {//???????????? ???? ????????????
                if (!(a % b)) //???????? ?? ?????????????? ???? b ?????? ??????????????
                    return a;//???????????? ?? ?????? ?? ???????? ??????????
                return (b * (x + 1) - a) < (a - b * x) ? b * x : b * (x + 1); //?????????? ???????????????? ?????????? b * x ?? b * (x + 1)
            }
            return 0;
        }
		
		function fallbackCopyTextToClipboard(text) {
		  var textArea = document.createElement("textarea");
		  textArea.value = text;
		  document.body.appendChild(textArea);
		  textArea.focus();
		  textArea.select();

		  try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			UIkit.notification({ message: '?????????????????? ??????????????????????', status: 'success' });
		  } catch (err) {
			  UIkit.notification({ message: '??????????????! ', status: 'danger' });
		  }

		  document.body.removeChild(textArea);
		}
		function copyTextToClipboard(text) {
		  if (!navigator.clipboard) {
			fallbackCopyTextToClipboard(text);
			return;
		  }
		  navigator.clipboard.writeText(text).then(function() {
			UIkit.notification({ message: '?????????????????? ??????????????????????', status: 'success' });
		  }, function(err) {
			UIkit.notification({ message: '??????????????! ', status: 'danger' });
		  });
		}
		
		
		function DateToUnix(dateString)
		{
			return + new Date(dateString);
		}
        function DATEtoUTC(dateString) {
            var date = new Date(dateString);
            return "/Date("+Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())+")/";
        }
        function DATETIMEtoUTC(dateString) {
            var date = new Date(dateString);
            return "/Date("+Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes())+")/";
        }
        function getdateToYYYY_NN_DD(date) {
            var d = new Date(date);
            var string = d.getFullYear()  + "-"+ ("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + (d.getDate())).slice(-2) ;
            return string;
        }
        function getdateToYYYY_NN_DD_HH_MM(date) {
            var d = new Date(date);
            var string = d.getFullYear()  + "-"+ ("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + (d.getDate())).slice(-2) + "T" + d.getHours()+ ":" + d.getMinutes();
            return string;
        }
        function getdate(dateString) {
            var date = new Date(dateString);
            var dd = ("00" + (date.getDate())).slice(-2) + "." +
                ("00" + (date.getMonth() + 1)).slice(-2) + "." +
                date.getFullYear() + " " +
                ("00" + date.getHours()).slice(-2) + ":" +
                ("00" + date.getMinutes()).slice(-2) + ":" +
                ("00" + date.getSeconds()).slice(-2);
            if (dd == '01.01.1 00:00:00') {
                dd = "-";
            }
            return dd;
        }
        function getdate2(dateString) {
        var date = new Date(dateString);
        var dd = ("00" + (date.getDate())).slice(-2) + "." +
          ("00" + (date.getMonth() + 1)).slice(-2) + "." +
          date.getFullYear();
        return dd;
        }
        function UTCtoDATEFormat(dateString) {
            if (dateString == "/Date(-7187655)/" || dateString == "/Date(-62135596800000)/") return '';
            var date = UTCtoDATE(dateString);
            var dd = ("00" + (date.getDate())).slice(-2) + "." +
              ("00" + (date.getMonth() + 1)).slice(-2) + "." +
              date.getFullYear();
            return dd;
        }
        function UTCtoDATETIMEFormat(dateString) {

            var date = UTCtoDATE(dateString);
            var dd = ("00" + (date.getDate())).slice(-2) + "." +
              ("00" + (date.getMonth() + 1)).slice(-2) + "." +
              date.getFullYear() + " " +  date.getHours()+ ":" + date.getMinutes();
            return dd;
        }
        function UTCtoDATE(dateString) {

            var date = new Date();
            date.setTime(+dateString.replace("/Date(", "").replace(")/", ""));
            return date;
        }

function minMaxFilterEditor (cell, onRendered, success, cancel, editorParams){

    var end;

    var container = document.createElement("span");

    //create and style inputs
    var start = document.createElement("input");
    start.setAttribute("type", "date");
	start.classList.add("uk-input");
    start.setAttribute("placeholder", "?????? (??????????????)");
    start.style.padding = "4px";
    start.style.width = "50%";
    start.style.boxSizing = "border-box";

    start.value = cell.getValue();

    function buildValues(){
        success({
            start:start.value,
            end:end.value,
        });
    }

    function keypress(e){
        if(e.keyCode == 13){
            buildValues();
        }

        if(e.keyCode == 27){
            cancel();
        }
    }

    end = start.cloneNode();
    end.setAttribute("placeholder", "???? (??????????????)");

    start.addEventListener("change", buildValues);
    start.addEventListener("blur", buildValues);
    start.addEventListener("keydown", keypress);

    end.addEventListener("change", buildValues);
    end.addEventListener("blur", buildValues);
    end.addEventListener("keydown", keypress);


    container.appendChild(start);
    container.appendChild(end);

    return container;
 }
function minMaxFilterFunction(headerValue, rowValue, rowData, filterParams){
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

    //convert strings into dates
let start='', end='', val='';
    if(headerValue.start != ""){
        start = new Date(headerValue.start);
    } 
    if(headerValue.end != ""){
       end = new Date(headerValue.end );
    }
    
    //compare dates
    if(rowValue){
        val = new Date(rowValue);

        if(start != ""){
            if(end != ""){
                return val >= start && val <= end;
            }else{
                return val >= start;
            }
        }else{
            if(end != ""){
                return val <= end;
            }
        }
    }

    return true; //must return a boolean, true if it passes the filter.
}


function validate(str, type){
	if(str == "")
		return false;
	switch (type){
		case 'email':
			var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
			break;
		case 'login' :
			var pattern = /^[??-????-??a-zA-Z0-9????????????????]{4,}$/; 
			break;
		case 'password':
			var pattern = /^[??-????-??a-zA-Z0-9????????????????]{8,}$/; 
			break;
		default:
			return false;
		}
	return pattern.test(str);
        
}



        function regE(text, type) {
            while (text.indexOf("  ", " ") != -1) {
                text = text.replace("  ", " ");
            }
            switch (type) {
                case 1:
                    var pattern = new RegExp(/^[0-9]+(\.[0-9]+)?$/);
                    break
                case 2:
                    var pattern = new RegExp(/^(([??-????-??a-zA-Z0-9????????????????\'\"???\.???:&\/\\,;\*\????\s)\(-]+\s?){1,})$/i);
                    break
                case 3:
                    var pattern = new RegExp(/^(([??-????-??a-zA-Z0-9????????????????]+\s?){6,})$/i);
                    break
                case 4:
                    var pattern = new RegExp(/^(([??-????-??a-zA-Z0-9????????????????]){6,})$/i);
                    break
                case 5:
                    var pattern = new RegExp(/^(([??-????-??a-zA-Z0-9????????????????\'\"???\????.???:&,;\*)(\[\]/-]+\s?){1,})$/i);
                    break
                case 6:
                    var pattern = new RegExp(/^(([??-????-??a-zA-Z0-9????????????????\.]){2,})$/i);
                    break
                default:
                    return false;
            }

            return pattern.test(text);
        }
        function sortTabulator(a, b, dictionary) {
            //return getArrayStringForId(a,dictionary).localeCompare(getArrayStringForId(b,dictionary));
			let myMap = new Map(dictionary.map(obj => [ obj.id, obj.name ]));
			let aa = myMap.get(a);
			let bb = myMap.get(b);
			return (aa > bb) ? 1 : ((bb > aa) ? -1 : 0);
        };

        function getArrayStringForId(stringarrayid, dictionary) {
            return dictionary.filter(i => ((stringarrayid && stringarrayid.split) ? stringarrayid.split(',') : []).includes(i.id.toString())).map(i => i.name).join(', ');
        }

        function filterTabulator(headerValue, rowData, dictionary) {
            if (getArrayStringForId(rowData, dictionary).toLowerCase().indexOf(headerValue.toLowerCase()) > -1)
                return true;
            return false;
        }

        function gettabulator(urlload, columns, select, rowformatter, idcontainer, paginationSize) {
            try {
                table = new Tabulator((idcontainer ? idcontainer : "#tableobj"), {
                    ajaxURL: urlload,
                    //gressiveRender : true ,
                    ajaxLoaderLoading: "<div style='display:inline-block; border:4px solid #333; border-radius:10px; background:#fff; font-weight:bold; font-size:16px; color:#000; padding:10px 20px;'>???????????????????????? ??????????</div>",
                    movableColumns: true,
                    layout: (window.outerWidth < 768 ? "fitData" : "fitColumns"), //fit columns to width of table (optional) fitColumns
                    resizableRows: true,
                    resizableColumns: "header",
                    rowFormatter: rowformatter,
                    columns: columns,
                    pagination: "local",
                    paginationSize: paginationSize ? paginationSize : 20,
                    paginationSizeSelector: [10, 20, 50, 100, 200],
                    selectable: select,
                    height:"100%",
                    tooltipsHeader: true,
                    tooltips: false,
                    dataTree: true,
                    dataTreeStartExpanded: true,
                    //???????? ???? ???????????? ???????????????? ????????
                    rowClick: function (e, row) { //trigger an alert message when the row is clicked
                        this.selectedRow = row.getData();
                        // this.$store.dispatch('zoomToSelectedFeature', { url: this.currentLayer.identity.geometryMethod + this.selectedRow.Id, layer: this.currentLayer, row: this.selectedRow });
                    }.bind(this),
                    locale: true,
                    langs: {
                        "uk": {
                            "ajax": {
                                "loading": "????????????????", //ajax loader text
                                "error": "??????????????", //ajax error text
                            },
                            "pagination": {
                                "page_size": "", //label for the page size select element
                                "first": "??????????", //text for the first page button
                                "first_title": "?????????? ????????.", //tooltip text for the first page button
                                "last": "??????????????",
                                "last_title": "?????????????? ????????????????",
                                "prev": "??????????????????",
                                "prev_title": "?????????????????? ????????????????",
                                "next": "????????????????",
                                "next_title": "???????????????? ????????????????",
                            }
                        },
                    },
                });
                table.setLocale("uk");
                return table;
            }
            catch (e) {
                alert(e);
                UIkit.notification({ message: '??????????????! ???????? ???? ???????? ?????????????????????? ?? ??????????????', status: 'danger' });
            }
        }
        function openIcon(value) {
            if (value.getColumn().getDefinition().field == '????????????????')
                return '<a  class="uk-icon superRootRole" uk-icon="trash"></a>'
            if (value.getColumn().getDefinition().field == '????????????????????')
                return '<a   class="uk-icon" uk-icon="pencil" ></a>'
			
			if (value.getColumn().getDefinition().field == '??????????????????????')
                return '<a  class="uk-icon" uk-icon="download" ></a>'
			if (value.getColumn().getDefinition().field == '????????????????????')
                return '<a   class="uk-icon" uk-icon="info" ></a>'

             if (value.getColumn().getDefinition().field == 'arrayservices')
                return  value.getData().fileType==3 ? '<a  class="uk-icon-link" uk-icon="star" ></a>' : ''

            if (value.getColumn().getDefinition().field == '??????????????????')
                return '<a  class="uk-icon-link" uk-icon="folder" ></a>'
            if (value.getColumn().getDefinition().field == 'Actual')
                return value.getData().Actual ? '<a  class="uk-icon-link" uk-icon="check" ></a>' : ''
            if (value.getColumn().getDefinition().field == 'isPay')
                return value.getData().isPay ? '<a  class="uk-icon-link" uk-icon="check" ></a>' : ''
            if (value.getColumn().getDefinition().field == '+1')
            return '<a  class="uk-icon-link" uk-icon="triangle-up" ></a>'
            if (value.getColumn().getDefinition().field == '-1')
                return '<a  class="uk-icon-link" uk-icon="triangle-down" ></a>'
            if (value.getColumn().getDefinition().field == '??????????????????????')
                return '<a  class="uk-icon-link" uk-icon="download" ></a>'
            if (value.getColumn().getDefinition().field == '????????????????')
                return '<a  class="uk-icon-link" uk-icon="file-text" ></a>'
            if (value.getColumn().getDefinition().field == 'status')
                return value.getData().status == 2 ? '????????????????' : (value.getData().status == 1 ? '?? ????????????' : "????????????????")
        }
        function deleteobject(urldelete, data, token, before, after, textadd) {
            buttonconfirm("??????????!", (textadd ? textadd : "") + "???????????????? ?????? ???????????????????? ???????????????????????", async function func() {
            $('#load').removeClass("hide-loader");
            $.ajax({
                url: urldelete,
                   type: "DELETE",
                    data: JSON.stringify(data),
					headers: {
						token:token
					},
					cache : false,
					processData: false,
					contentType: "application/json; charset=utf-8",
                success: function (data) {
                    
                    if (before)
                        before();
                    if (after)
                        after();
					$('#load').addClass("hide-loader");
                     UIkit.notification({ message: '????????????????', status: 'success' });
                },
				error: function (data) {
					if(data)
					 GETERROR(data);
					$('#load').addClass("hide-loader");
					
				},
            });
        });
        }
		function getCity(){
			try{
				//?????? ????????????????????
				if(window.location.protocol != "https:" && window.location.protocol != "http:"){
					//let s = window.location.substring(0, window.location.lastIndexOf('/'));
					//return s.substring(s.lastIndexOf('/')+1);
					return 'kharkiv';
				}			
			
			if(window.location.pathname.length > 0)
			{
				let t = window.location.pathname.substring(1, window.location.pathname.lastIndexOf('/'));
				if(t==null || t==undefined || t=="" || t=="/" || t.indexOf("/") !=-1){
					$(location).attr('href',window.location.origin + '/cities.html');
				}
				else{
					return t;
				}
			}
			else 
				$(location).attr('href',window.location.origin + '/cities.html');
			}
			catch{
				$(location).attr('href',window.location.origin + '/cities.html');
			}
		}
		
		function DataObjToFormData(obj) {
			let fd = new FormData();
             var arrayname = Object.getOwnPropertyNames(obj);
            arrayname.forEach(function (rgItem) {
                fd.append(rgItem, JSON.stringify(obj[rgItem]));
            });
            return fd;
        }
		
		
		 function saveobjectFORMDATA(urlsave, data, token,type, before, after){
			 $('#load').removeClass("hide-loader");
    $.ajax({
            type: type,
            enctype: 'multipart/form-data',
            url: urlsave,
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            headers: {
                token: token
            },
            success: function (data) {
					before();
					
						if(data.token){
							removetoken();
							addtoken(data.token);
						}
						if(data.url)
						{
							let city = data.url.substring(data.url.lastIndexOf('/')+1); 
							$(location).attr('href',window.location.origin + '/'+ city+ '/index.html');
						}
						switch (data) {
					  case "OK":
						UIkit.notification({ message: '??????????????????', status: 'success' });
						break;
					  default:
						let city = data.substring(data.lastIndexOf('/')+1); 
						$(location).attr('href',window.location.origin + '/'+ city+ '/index.html');
						UIkit.notification({ message: '??????????????????' , status: 'success' });
						break;
					}
					after();
					$('#load').addClass("hide-loader");
                },
				 error: function (data) {
					 if(data)
					 GETERROR(data);
					$('#load').addClass("hide-loader");
					
				},
        });
 }
		
		
		function GETobjectDATA(url, data, token, before, after) {
            $('#load').removeClass("hide-loader");
            $.ajax({
                url: urlsave,
                    type: 'GET',
                    data: JSON.stringify(data),
					headers: {
						token:token
					},
					cache : false,
					processData: false,
					contentType: "application/json; charset=utf-8",
                success: function (data) {
					before();
					switch (data) {
					  case "OK":
						UIkit.notification({ message: '??????????????????', status: 'success' });
						break;
					  default:
						UIkit.notification({ message: data , status: 'success' });
						break;
					}
					after();
					$('#load').addClass("hide-loader");
					return data;
                },
				 error: function (data) {
					 if(data)
					 GETERROR(data);
					$('#load').addClass("hide-loader");
					return null;
				},
            });
        }
		
        function saveobject(urlsave, data, token, type, before, after) {
            $('#load').removeClass("hide-loader");
            $.ajax({
                url: urlsave,
                    type: type,
                    data: JSON.stringify(data),
					headers: {
						token:token
					},
					cache : false,
					processData: false,
					contentType: "application/json; charset=utf-8",
                success: function (data) {
					before();
					switch (data) {
					  case "OK":
						UIkit.notification({ message: '??????????????????', status: 'success' });
						break;
					  default:
						UIkit.notification({ message: '??????????????????' , status: 'success' });
						break;
					}
					$('#load').addClass("hide-loader");
					after();
					
                },
				 error: function (data) {
					 if(data)
					 GETERROR(data);
					$('#load').addClass("hide-loader");
					
				},
            });
        }
		function showModal(name){
			if (document.getElementById(name)) {
                            UIkit.modal("#"+name).show();
                            $("#"+name).scrollTop(0);
                        }
		}
		function hideModal(name){
			if (document.getElementById(name)) {
                            UIkit.modal("#"+name).hide();
                            $("#"+name).scrollTop(0);
                        }
		}
		
		function GETERROR(data){
			try{
			if(data==undefined){
				UIkit.notification({ message: '?????????????????????? ??????????????', status: 'danger'});
				 $('#load').addClass("hide-loader");
				return;
			}
			let err = (data && data.responseJSON && data.responseJSON.errorCode) ? data.responseJSON.errorCode : ((data && data.response.data && data.response.data.errorCode) ? data.response.data.errorCode: '');

			switch (err) {
					  case "INVALID_TOKEN":
						document.location.href = "login.html";
						break;
					case "INCORRECT LOGIN/PASSWORD":
						UIkit.notification({ message: '?????????????? ?? ???????????? ?????? ?? ????????????', status: 'danger'});
						break;
					case "INCORRECT CITY":
						UIkit.notification({ message: '?????????????? ?????????? ??????????', status: 'danger'});
						break;
					case "INTERNAL ERROR":
						UIkit.notification({ message: '?????????????????? ?????????????? ??????????????', status: 'danger'});
						break;
					case "CANNOT TRANSLITERATE CITY NAME":
						UIkit.notification({ message: '?????????????????? ???????????????????? ?????????? ??????????', status: 'danger'});
						break;
					case "EMPTY REGISTER TITLE":
						UIkit.notification({ message: '?????????????????? ????????????????', status: 'danger'});
						break; 
					case "EMPTY EMAIL":
						UIkit.notification({ message: '?????????????????? ???????????? ??????????????', status: 'danger'});
						break;
					case "INVALID EMAIL":
						UIkit.notification({ message: '?????????????? ?? ?????????????????????? ????????????', status: 'danger'});
						break;
					case "EMPTY PHONE NUMBER":
						UIkit.notification({ message: '?????????? ???????????????? ???? ????????????????', status: 'danger'});
						break;                         
					case "LATITUDE OUT OF UKRAINE BOUNDARIES":
						UIkit.notification({ message: '???????????????????? ???????????? ?????????????????????? ???? ???????????? ??????????????', status: 'danger'});
						break;
					case "LONGITUDE OUT OF UKRAINE BOUNDARIES" :
						UIkit.notification({ message: '???????????????????? ?????????????? ?????????????????????? ???? ???????????? ??????????????', status: 'danger'});
						break;
					case "LOGIN LESS 4 SYMBOLS":
						UIkit.notification({ message: '?????????? ?????????????????????? ???????????? ?????? ?? 4-?? ????????????????', status: 'danger'});
						break;
					case "PASSWORD LESS 8 SYMBOLS":
						UIkit.notification({ message: '???????????? ?????????????????????? ???????????? ?????? ?? 8-???? ????????????????', status: 'danger'});
						break;
					case "EMPTY RESPONSIBLE PERSON NAME":
						UIkit.notification({ message: "????'?? ???????????????????????????? ?????????? ???? ??????????????", status: 'danger'});
						break;
					case "EMPTY STREET NAME":
						UIkit.notification({ message: '?????????? ???????????? ??????????????', status: 'danger'});
						break;
					case "EMPTY AUTHORITY NAME":
						UIkit.notification({ message: '?????????????? ?????????? ????????????', status: 'danger'});
						break;
					case "EMPTY DISTRICT NAME":
						UIkit.notification({ message: '?????????????? ?????????? ????????????', status: 'danger'});
						break;
					case "EMPTY DECISION TITLE":
						UIkit.notification({ message: '?????????? ?????????????? ???? ??????????????', status: 'danger'});
						break;
					case "EMPTY PHONE NUMBER":
						UIkit.notification({ message: '???????????????? ?????????? ????????????????', status: 'danger'});
						break;
					case "EMPTY ADDRESS NUMBER":
						UIkit.notification({ message: '?????????????? ????????????', status: 'danger'});
						break;
					case "INCORRECT ADDRESS STATUS":
						UIkit.notification({ message: '?????????????? ?? ?????????????? ????????????', status: 'danger'});
						break;
					case "EMPTY STREET TYPE NAME":
						UIkit.notification({ message: '???????????????? ?????? ????????????', status: 'danger'});
						break;
					
					case "EMPTY SHORT STREET TYPE NAME":
						UIkit.notification({ message: '???????????????? ???????????????????? ?????? ????????????', status: 'danger'});
						break;
					case "USER ID NOT FOUND":
						UIkit.notification({ message: '???????????????????? ???? ??????????', status: 'danger'});
						break;
					case "STREET ID NOT FOUND":
						UIkit.notification({ message: '???????????? ???? ??????????', status: 'danger'});
						break;
					case "STREET_TYPE ID NOT FOUND":
						UIkit.notification({ message: '?????? ???????????? ???? ??????????', status: 'danger'});
						break;
					case "DISTRICT ID NOT FOUND":
						UIkit.notification({ message: '?????????? ???? ??????????', status: 'danger'});
						break;
					case "AUTHORITY ID NOT FOUND":
						UIkit.notification({ message: '?????????? ???? ??????????', status: 'danger'});
						break;
					case "DECISION ID NOT FOUND":
						UIkit.notification({ message: '?????????? ???? ??????????', status: 'danger'});
						break;
					case "ADDRESS ID NOT FOUND":
						UIkit.notification({ message: '???????????? ???? ??????????', status: 'danger'});
						break;
					case "EMPTY CITY NAME":
						UIkit.notification({ message: '?????????????? ?????????? ??????????', status: 'danger'});
						break;
					case "CANNOT SAVE FILE":
						UIkit.notification({ message: '?????????????? ?????? ???????????????????? ??????????????????', status: 'danger'});
						break;
					case "LOGO_IS_NOT_IMAGE":
						UIkit.notification({ message: '???????????????????????? ?????????????? ???? ?? ????????????????', status: 'danger'});
						break;
					case "CITY REGISTER ALREADY EXISTS":
						UIkit.notification({ message: '???????????? ?????????????????????? ?????????? ?????? ??????????', status: 'danger'});
						break;
					case "TRYING TO DELETE YOURSELF":
						UIkit.notification({ message: '?????? ?????????????????? ?????????? ???????????????????? ???????????? ???????????????????? ???? ????????????????????????', status: 'danger'});
						break;
					case "LOGO IS NOT IMAGE":
						UIkit.notification({ message: '?????????????? ???? ?? ?????????????????? ?????? ?????? ???????????????? ???? ??????????????????????????', status: 'danger'});
						break;
					case "FILE STORAGE ERROR":
						UIkit.notification({ message: '?????????????? ???????????????????????? ??????????????', status: 'danger'});
						break;
					case "FILE NOT FOUND AT FILE STORAGE":
						UIkit.notification({ message: '???????? ???? ??????????', status: 'danger'});
						break;
					case "EMPTY DOCUMENT TYPE NAME":
						UIkit.notification({ message: '???????????????? ???? ?????? ????????', status: 'danger'});
						break;
					case "EMPTY DOCUMENT NUMBER":
						UIkit.notification({ message: '???????????????? ???? ?????? ??????????', status: 'danger'});
						break;
					case "EMPTY DOCUMENT TITLE":
						UIkit.notification({ message: '???????????????????? ???? ??????????', status: 'danger'});
						break;
					case "DOCUMENT NOT FOUND":
						UIkit.notification({ message: '???????????????? ???? ??????????', status: 'danger'});
						break;
					case "INCORRECT URL PART":
						UIkit.notification({ message: '?????????????? ?? ?????????????? URL-????????????', status: 'danger'});
						break;
					case "INCORRECT LINK ACTION":
						UIkit.notification({ message: "?????????????? ?????????????? ?????? ????????'???????? ??????????????????", status: 'danger'});
						break;
					case "INCORRECT LINKED ENTITY":
						UIkit.notification({ message: "?????????????? ?????????????? ?????? ????????'???????? ??????????????????", status: 'danger'});
						break;
					case "DOCUMENT IS ALREADY LINKED":
						UIkit.notification({ message: "???????????????? ?????? ??????????????????????", status: 'danger'});
						break;
					case "DOCUMENT HAS_NO LINKS":
						UIkit.notification({ message: "???????????????? ???? ?????? ????'??????????", status: 'danger'});
						break;
					case "USER ID NOT FOUND":
						UIkit.notification({ message: '???????????????????? ???? ??????????', status: 'danger'});
						break;
					case "STREET ID NOT FOUND":
						UIkit.notification({ message: '???????????? ???? ??????????', status: 'danger'});
						break;
					case "STREET_TYPE ID NOT FOUND":
						UIkit.notification({ message: '?????? ???????????? ???? ??????????', status: 'danger'});
						break;
					case "DISTRICT ID NOT FOUND":
						UIkit.notification({ message: '??????????  ???? ??????????', status: 'danger'});
						break;	
					case "ADDRESS ID NOT FOUND":
						UIkit.notification({ message: '???????????? ???? ??????????', status: 'danger'});
						break;
					case "AUTHORITY ID NOT FOUND":
						UIkit.notification({ message: '??????????  ???? ??????????', status: 'danger'});
						break;
					case "DOCUMENT TYPE ID NOT FOUND":
						UIkit.notification({ message: '?????? ?????????????????? ???? ??????????', status: 'danger'});
						break;
					case "NO SUFFICIENT PRIVILEGES":
						UIkit.notification({ message: '?????????? ???????? ???? ?????????????????? ???????? ????????????????', status: 'danger'});
						break;
					case "There is no an user with such id":
						UIkit.notification({ message: '?????????????????????? ?? ?????????? ?????????????????????????????? ??????????', status: 'danger'});
						break;
					case "INVALID DOCUMENT LINKS STR":
						UIkit.notification({ message: "?????????????? ????????'????????", status: 'danger'});
						break;
					case "IMPORT ERROR":
						UIkit.notification({ message: '?????????????? ?????? ??????????????', status: 'danger'});
						break;
					case "STREET TYPE HAS LINKED STREETS":
						UIkit.notification({ message: '?????????? ?????? ???????????? ???????????????????????????????? ?? ????????????', status: 'danger'});
						break;
					case "DISTRICT HAS LINKED ADDRESSES":
						UIkit.notification({ message: '?????????? ?????????? ???????????????????????????????? ?? ??????????????', status: 'danger'});
						break;
					case "DOCUMENT TYPE HAS LINKED DOCUMENTS":
						UIkit.notification({ message: '?????????? ?????? ?????????????????? ???????????????????????????????? ?? ????????????????????', status: 'danger'});
						break;
					case "AUTHORITY HAS LINKED DOCUMENTS":
						UIkit.notification({ message: '?????????? ???????????????????????????????? ?? ????????????????????', status: 'danger'});
						break;
					case "REGISTER ID NOT FOUND":
						UIkit.notification({ message: '???????????? ???? ??????????', status: 'danger'});
						break;
					case "STREET HAS LINKED ADDRESSES":
						UIkit.notification({ message: '???????? ???????????? ???????????????????????????????? ?? ??????????????', status: 'danger'});
						break;
					case "SECONDARY ADDRESS TYPE HAS LINKED SECONDARY ADDRESSES":
						UIkit.notification({ message: '?????????? ?????? ???????????????????????????????? ?? ?????????????????? ??????????????', status: 'danger'});
						break;
					case "ADDRESS HAS LINKED SECONDARY ADDRESSES":
						UIkit.notification({ message: '???????? ???????????? ???????????????????????????????? ?? ?????????????????? ??????????????', status: 'danger'});
						break;
					case "EMPTY SECONDARY ADDRESS TYPE NAME":
						UIkit.notification({ message: '?????????????? ?????????? ???????? ?????????????????? ????????????', status: 'danger'});
						break;
					case "EMPTY SECONDARY ADDRESS NUMBER":
						UIkit.notification({ message: '???????????????? ?????????? ?????????????????? ????????????', status: 'danger'});
						break;
					default:
						UIkit.notification({ message: '?????????????????????? ??????????????', status: 'danger'});
						break;
					}
					
			}
			catch{
				UIkit.notification({ message: '?????????????????????? ??????????????', status: 'danger'});
				 $('#load').addClass("hide-loader");
			}
			return;
		}
		
		function removetoken()
		{
			localStorage.removeItem('token');
		}
		
		function addtoken(token){
			localStorage.setItem('token', token);
		}
		function gettoken(){
			return localStorage.getItem('token');
		}
		
		
        function getobject(urlget, id, before, after, setcard) {
                $('#load').removeClass("hide-loader");
                $.ajax({
                    url: urlget,
                    dataType: "json",
                    traditional: true,
                    data: { id: id },
                    success: function (data) {

                        if(before) before();
                        
                        var arrayname = Object.getOwnPropertyNames(data);
                        for (var i = 0; i < arrayname.length; i++) {
                            let element = document.getElementById(arrayname[i]);
                            if (element)
                        switch (element.type) {
                            case "number": case "text": case "color": case "select-one": case "textarea": element.value = data[arrayname[i]]; $('#' + arrayname[i]).trigger("change"); break;
                            case "date": element.value = data[arrayname[i]] == null || data[arrayname[i]]==""|| data[arrayname[i]]=="0001-01-01T00:00:00"|| data[arrayname[i]]=="1970-01-01T00:00:12.345" ? "" : getdateToYYYY_NN_DD(new Date(data[arrayname[i]])); $('#' + arrayname[i]).trigger("change"); break;
                            case "datetime-local": element.value = data[arrayname[i]] == null || data[arrayname[i]] == "" || data[arrayname[i]]=="0001-01-01T00:00:00"|| data[arrayname[i]]=="1970-01-01T00:00:12.345" ? "" : getdateToYYYY_NN_DD_HH_MM(new Date(data[arrayname[i]])); $('#' + arrayname[i]).trigger("change"); break;
                            //case "date": element.value = data[arrayname[i]] == null || data[arrayname[i]]==""|| data[arrayname[i]]=="/Date(-7187655)/" || data[arrayname[i]]=="/Date(12345)/" ? "" : getdateToYYYY_NN_DD(UTCtoDATE(data[arrayname[i]])); $('#' + arrayname[i]).trigger("change"); break;
                            //case "datetime-local": element.value = data[arrayname[i]] == null || data[arrayname[i]]=="" || data[arrayname[i]]=="/Date(-7187655)/" || data[arrayname[i]]=="/Date(12345)/" ? "" : element.value = getdateToYYYY_NN_DD_HH_MM(UTCtoDATE(data[arrayname[i]])); $('#' + arrayname[i]).trigger("change"); break;
                            case "checkbox": $('#' + arrayname[i]).prop("checked", data[arrayname[i]]).trigger("change"); break;
                            case "select-multiple": $('#' + arrayname[i]).val(data[arrayname[i]] != null ? data[arrayname[i]].split(',') : null).trigger("change"); break;
                         }
                        }
                        if (setcard)
                            CARD = data;
						if(after) after();
                        $('#load').addClass("hide-loader");
                    },
					error: function (data) {
						if(data)
					 GETERROR(data);
					$('#load').addClass("hide-loader");
					
				},
                });

        }
        function getobject_ByData(data, before , after) {
                        
                        if (!data) {
                            UIkit.notification({ message: '??????????????', status: 'danger' });
                            return;
                        }
						if(before) before();
                        var arrayname = Object.getOwnPropertyNames(data);
                        for (var i = 0; i < arrayname.length; i++) {
                            let element = document.getElementById(arrayname[i]);
                            if (element)
                        switch (element.type) {
                            case "number": case "text": case "color": case "select-one": case "textarea": element.value = data[arrayname[i]]; $('#' + arrayname[i]).trigger("change"); break;
                            case "date": element.value = data[arrayname[i]] == null || data[arrayname[i]]==""|| data[arrayname[i]]=="0001-01-01T00:00:00"|| data[arrayname[i]]=="1970-01-01T00:00:12.345" ? "" : getdateToYYYY_NN_DD(new Date(data[arrayname[i]])); $('#' + arrayname[i]).trigger("change"); break;
                            case "datetime-local": element.value = data[arrayname[i]] == null || data[arrayname[i]] == "" || data[arrayname[i]]=="0001-01-01T00:00:00"|| data[arrayname[i]]=="1970-01-01T00:00:12.345" ? "" : getdateToYYYY_NN_DD_HH_MM(new Date(data[arrayname[i]])); $('#' + arrayname[i]).trigger("change"); break;
                            //case "date": element.value = data[arrayname[i]] == null || data[arrayname[i]]==""|| data[arrayname[i]]=="/Date(-7187655)/" || data[arrayname[i]]=="/Date(12345)/" ? "" : getdateToYYYY_NN_DD(UTCtoDATE(data[arrayname[i]])); $('#' + arrayname[i]).trigger("change"); break;
                            //case "datetime-local": element.value = data[arrayname[i]] == null || data[arrayname[i]]=="" || data[arrayname[i]]=="/Date(-7187655)/" || data[arrayname[i]]=="/Date(12345)/" ? "" : element.value = getdateToYYYY_NN_DD_HH_MM(UTCtoDATE(data[arrayname[i]])); $('#' + arrayname[i]).trigger("change"); break;
                            case "checkbox": $('#' + arrayname[i]).prop("checked", data[arrayname[i]]).trigger("change"); break;
                            case "select-multiple": $('#' + arrayname[i]).val(data[arrayname[i]] != null ? data[arrayname[i]].split(',') : null).trigger("change"); break;
                         }
                        }
						if(after) after();
        }

        function getobject2(urlget, id, before, setcard) {
                $('#load').removeClass("hide-loader");
                $.ajax({
                    url: urlget,
                    dataType: "json",
                    traditional: true,
                    data: { id: id },
                    success: function (data) {
                        $('#load').addClass("hide-loader");
                        if (data == "ERRORDATA" || data == "ERROR") {
                            UIkit.notification({ message: '??????????????', status: 'danger' });
                            return;
                        }
                        if (data == "ERRORUSER") {
                            location.href = "/Home/Login";
                            return;
                        }
                        var arrayname = Object.getOwnPropertyNames(data);
                        for (var i = 0; i < arrayname.length; i++) {
                            let element = document.getElementById(arrayname[i]);
                            if (element)
                        switch (element.type) {
                            case "number": case "text": case "color": case "select-one": case "textarea": element.value = data[arrayname[i]]; $('#' + arrayname[i]).trigger("change"); break;
                            case "date": element.value = data[arrayname[i]] == null || data[arrayname[i]]==""|| data[arrayname[i]]=="0001-01-01T00:00:00"|| data[arrayname[i]]=="1970-01-01T00:00:12.345" ? "" : data[arrayname[i]]; $('#' + arrayname[i]).trigger("change"); break;
                            case "datetime-local": element.value = data[arrayname[i]] == null || data[arrayname[i]] == "" || data[arrayname[i]]=="0001-01-01T00:00:00"|| data[arrayname[i]]=="1970-01-01T00:00:12.345" ? "" : data[arrayname[i]]; $('#' + arrayname[i]).trigger("change"); break;
                            //case "date": element.value = data[arrayname[i]] == null || data[arrayname[i]]==""|| data[arrayname[i]]=="/Date(-7187655)/" || data[arrayname[i]]=="/Date(12345)/" ? "" : getdateToYYYY_NN_DD(UTCtoDATE(data[arrayname[i]])); $('#' + arrayname[i]).trigger("change"); break;
                            //case "datetime-local": element.value = data[arrayname[i]] == null || data[arrayname[i]]=="" || data[arrayname[i]]=="/Date(-7187655)/" || data[arrayname[i]]=="/Date(12345)/" ? "" : element.value = getdateToYYYY_NN_DD_HH_MM(UTCtoDATE(data[arrayname[i]])); $('#' + arrayname[i]).trigger("change"); break;
                            case "checkbox": $('#' + arrayname[i]).prop("checked", data[arrayname[i]]).trigger("change"); break;
                            case "select-multiple": $('#' + arrayname[i]).val(data[arrayname[i]] != null ? data[arrayname[i]].split(',') : null).trigger("change"); break;
                         }
                        }
                        if (document.getElementById('modalCard')) {
                            UIkit.modal('#modalCard').show();
                            $('#modalCard').scrollTop(0);
                            if(before) before();
                        }
                        if (setcard)
                            CARD = data;
                    }
                });

        }

        function getObjectByData(data, classname) {
                        var arrayname = Object.getOwnPropertyNames(data);
                        for (var i = 0; i < arrayname.length; i++) {
                            let element = document.getElementById(arrayname[i]);
                            if (element && element.className.indexOf(classname) != -1)
                                switch (element.type) {
                                    case "number": case "text": case "color": case "select-one": case "textarea": element.value = data[arrayname[i]]; $('#' + arrayname[i]).trigger("change"); break;
                                    case "date": element.value = data[arrayname[i]] == null || data[arrayname[i]]=="" || data[arrayname[i]]=="0001-01-01T00:00:00"|| data[arrayname[i]]=="1970-01-01T00:00:12.345" ? "" : getdateToYYYY_NN_DD(new Date(data[arrayname[i]])); $('#' + arrayname[i]).trigger("change"); break;
                                    case "datetime-local": element.value =  data[arrayname[i]] == null || data[arrayname[i]]=="" || data[arrayname[i]]=="0001-01-01T00:00:00"|| data[arrayname[i]]=="1970-01-01T00:00:12.345"  ? "" : getdateToYYYY_NN_DD_HH_MM(new Date(data[arrayname[i]])); $('#' + arrayname[i]).trigger("change"); break;
                                    //case "date": element.value = data[arrayname[i]] == null || data[arrayname[i]]=="" || data[arrayname[i]]=="/Date(12345)/" ? "" : getdateToYYYY_NN_DD(UTCtoDATE(data[arrayname[i]])); $('#' + arrayname[i]).trigger("change"); break;
                                    //case "datetime-local": element.value =  data[arrayname[i]] == null || data[arrayname[i]]=="" || data[arrayname[i]]=="/Date(12345)/"  ? "" : getdateToYYYY_NN_DD_HH_MM(UTCtoDATE(data[arrayname[i]])); $('#' + arrayname[i]).trigger("change"); break;
                                    case "checkbox": $('#' + arrayname[i]).prop("checked", data[arrayname[i]]).trigger("change"); break;
                                    case "select-multiple": $('#' + arrayname[i]).val(data[arrayname[i]] !=null ? data[arrayname[i]].split(','): null).trigger("change"); break;
                                 }
                        }
        }

        function getIntArray(array) {
        res = [];
        if (array.length > 0) {
            array.forEach(function (arItem) {
                if (!isNaN(arItem))
                    res.push(+arItem);
            });
        }
            return res;
    }
        function emptyform() {
        forEachClassName('uk-form-danger', i => i.classList.remove("uk-form-danger"));
        $('input[type=number]').val($('input[type=number]').attr("min") ? $('input[type=number]').attr("min") : 0);
        $('input[type=text]').val('');
        $('select').val(null).trigger("change");
        $('input[type=date]').val('');
            $('input[type=datetime-local]').val('');
            $('input[type=date].necessarilytext').val('@DateTime.Now.ToString("yyyy-MM-dd")');
            $('input[type=datetime-local].necessarilytext').val('@DateTime.Now.ToString("yyyy-MM-ddTHH:mm")');
         $('input[type=color]').val('#000000');   
        $("input[type=checkbox]").prop("checked", false);
        $('textarea').val('');
        $('.trrem').remove();
        }
        function emptyformbyclass(classname) {
        forEachClassName('uk-form-danger ' + classname, i => i.classList.remove("uk-form-danger"));
        $('input[type=number].'+ classname).val($('input[type=number]').attr("min") ? $('input[type=number]').attr("min") : 0);
        $('input[type=text].'+ classname).val('');
        $('select.'+ classname).val(null).trigger("change");
            $('input[type=date].' + classname).val('');
            $('input[type=datetime-local].' + classname).val('');

            $('input[type=date].necessarilytext.' + classname).val('@DateTime.Now.ToString("yyyy-MM-dd")');
            $('input[type=datetime-local].necessarilytext.' + classname).val('@DateTime.Now.ToString("yyyy-MM-ddTHH:mm")');
        $('input[type=color].'+ classname).val('#000000');
        $("input[type=checkbox]."+ classname).prop("checked", false);
        $('textarea.'+ classname).val('');
        $('.trrem.'+ classname).remove();
        }


        function forEachClassName(classnames, func) {
          const elements = document.getElementsByClassName(classnames);
          [...elements].forEach(func);
        }
		
		
        function kindOfGetCardData(classname) {
            let isError = false;

            forEachClassName('uk-form-danger ' + classname, i => i.classList.remove("uk-form-danger"));
			
			 forEachClassName('email ' + classname, i => {
                if (!validate(i.value, "email")) {
                    i.className += ' uk-form-danger';
                    isError = true;
					UIkit.notification({ message: 'Email ?????????????? ?????????????????????? ?????????? xxxxxx@xxxxx.xxxx', status: 'danger' });
                }
            });
			forEachClassName('login ' + classname, i => {
                if (!validate(i.value, "login")) {
                    i.className += ' uk-form-danger';
                    isError = true;
					UIkit.notification({ message: '?????????? ?????????????? ?????????????? ?????????????? 4 ?????????????? (????????????????, ???????????????? ???? ??????????)', status: 'danger' });
                }
            });
			forEachClassName('password ' + classname, i => {
                if (i.value !='' && !validate(i.value, "password")) {
                    i.className += ' uk-form-danger';
                    isError = true;
					UIkit.notification({ message: '???????????? ?????????????? ?????????????? ?????????????? 8 ???????????????? (????????????????, ???????????????? ???? ??????????)', status: 'danger' });
                }
            });
			
            forEachClassName('necessarilytext ' + classname, i => {
                if (i.value === 0 || i.value === '') {
                    i.className += ' uk-form-danger';
                    isError = true;
                }
            });
            forEachClassName('necessarilyselect ' + classname, i => {
                if (i.value === 0 || i.value === '' || i.value == '-1') {
                    i.className += ' uk-form-danger';
                    isError = true;
                }
            });
            if (isError) {
                UIkit.notification({ message: '?????????????????? ???????????????????????? ???????????????? ??????????', status: 'danger' });
                return false;
            }
             return true;
        }

        function getCardData(CARD, classname) {
            if (!kindOfGetCardData(classname ? classname : ''))
            {
                return null;
            }
            var arrayname = Object.getOwnPropertyNames(CARD);
        for (var i = 0; i < arrayname.length; i++) {
            var element = document.getElementById(arrayname[i]);
            if (element)
            switch (element.type) {
                case "number": CARD[arrayname[i]] = +element.value; break;
                case "text": case "password":  case "textarea": CARD[arrayname[i]] = element.value; break;
				case "select-one": CARD[arrayname[i]] = +element.value; break;
                case "date": CARD[arrayname[i]] = element.value =="" ? "0" : DateToUnix(element.value); break;
                case "datetime-local": CARD[arrayname[i]] = element.value =="" ? "0" : DateToUnix(element.value); break;
                case "checkbox": CARD[arrayname[i]] = element.checked; break;
                case "color": CARD[arrayname[i]] = element.value; break;
                case "select-multiple": CARD[arrayname[i]] = $('#' + arrayname[i]).val() && $('#' + arrayname[i]).val().length > 0 ? getIntArray($('#' + arrayname[i]).val()).toString() : [].toString(); break;
                default: CARD[arrayname[i]] = null;
            }
        }
        return CARD;
        }

        function SelectgroupDATA(idselect, data, allowClear, valueDefault, isCalltrigger) {
            let selectgroup = [];
            data.forEach((itm) => {
                if (itm.children.length > 0)
                    selectgroup.push({ id: '', text: itm.name, children: itm.children });
            })
            fillSelectgroup(idselect, selectgroup, allowClear, valueDefault, isCalltrigger);
        }



        function fillSelectgroup(idselect, data, allowClear, valueDefault, isCalltrigger) {
            $('#' + idselect).empty();
                $('#' + idselect).select2({
                    multiple: false,
                    allowClear: true,
                    placeholder: " ",
                    data: data
                }).on('select2-selecting', function(e) {
                    var $select = $(this);
                    if (e.val == '') {
                        e.preventDefault();
                        var childIds = $.map(e.choice.children, function(child) {
                            return child.id;
                        });
                        $select.select2('val', $select.select2('val').concat(childIds));
                        $select.select2('close');
                    }
                });
                if (allowClear) {
                $('#'+idselect).select2({
                placeholder: " ",
                allowClear: true
                });
                $('#' + idselect).append("<option> </option>");
                $('#' + idselect).val(null);
            }
            else
                $('#' + idselect).select2();

            if (valueDefault != null)
                $('#' + idselect).val(valueDefault);
            if (isCalltrigger) {
                $('#' + idselect).trigger("change")
            }
        }
        function fillSelect(idselect, data, paramid, paramname, allowClear, valueDefault, isCalltrigger, nameClear) {
            $('#' + idselect).empty();
            for (var i = 0; i < data.length; i++) {
                                var option = $("<option/>", {
                                    value: data[i][paramid],
                                    text: data[i][paramname]
                                });
                                $('#'+idselect).append(option);
            }
            if (allowClear) {
                $('#' + idselect).select2({
                    placeholder: (nameClear ? nameClear : " "),
                    allowClear: true
                });
                $('#' + idselect).append("<option> </option>");
                $('#' + idselect).val(null).trigger("change");
            }
            else {
                $('#' + idselect).select2();
                //if (data != null && data.length > 0)
                //    $('#' + idselect).val(data[0][paramid]);
            }
            if (valueDefault)
                $('#' + idselect).val(valueDefault);

            if (isCalltrigger) {
                $('#' + idselect).trigger("change").trigger("select2:select");
            }
        }
        function addActionItem(map, item, key) {
            myMap.set(key, item);
            return map;
        }
        function removeActionItem(map, key) {
            map.delete(key);
            return map;
        }
        function getActionItems(map) {
            let obj = [];
            map.forEach((itm) => {
                obj.push(itm);
            });
            return obj;
        }
        function sequence() {
            var counter = 0;
            function increment() {
                return counter++;
            }
            function nullify() {
                counter = 0;
            }
            return {
                next: increment,
                nullify: nullify,
            }
        }
        //$(function () {
        //$("#modalCard").keyup(function(event) {
        //    if (event.which === 13) {
        //        update();
        //    }
        //});
        //});
        function formatRepo(repo) {
            if (repo.loading) {
                return repo.text;
            }
        }
        function formatRepoSelection (repo) {
  return repo.full_name || repo.text;
        }