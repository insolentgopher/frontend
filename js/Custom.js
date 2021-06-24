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
            //выделить разные группы
            var radioGroups = [];
            for (var i = 0; i < radio.length; i++) {
                //если массив групп еще пустой, то просто добавляем группу и первый элемент массива
                if (radioGroups.length == 0)
                    pushNewGroup(radio[i],radioGroups);
                else {
                    //проверяем на наличие группы
                    if (checkRadioGroupName(radio[i].name, radioGroups))
                        //добавляем элемент в массив сущ группы
                        pushItemToGroupElements(radio[i], radioGroups);
                    else
                        //создаем еще один элемент группы
                        pushNewGroup(radio[i],radioGroups);
                }
            }
            //проинициализировать каждую группу
            radioGroups.forEach(function (rgItem) {
                $(rgItem.elements).prop('checked', true).trigger('change');
            });
        }

        if (check && check.length > 0) {
            //выделить разные группы
            var checkGroups = [];
            for (var i = 0; i < check.length; i++) {
                //если массив групп еще пустой, то просто добавляем группу и первый элемент массива
                if (checkGroups.length == 0)
                    pushNewGroup(check[i],checkGroups);
                else {
                    //проверяем на наличие группы
                    if (checkRadioGroupName(check[i].name, checkGroups))
                        //добавляем элемент в массив сущ группы
                        pushItemToGroupElements(check[i], checkGroups);
                    else
                        //создаем еще один элемент группы
                        pushNewGroup(check[i],checkGroups);
                }
            }
            //проинициализировать каждую группу
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
            return price.toFixed(2) + (money? ' грн':'' );
        }
        function buttonconfirm(_title, _text, func) {

            Swal.fire({
                title: _title,
                text: _text,
                icon: 'warning',
                showCancelButton: true,
                //confirmButtonColor: '#DD6B55',
                //cancelButtonColor: '#DD6B55',
                confirmButtonText: 'Так',
                cancelButtonText: "Ні",

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
                UIkit.notification({ message: 'Введене значення недопустиме, було замінено на найближче', status: 'danger' });
            }
        }
        let getClosestInteger = (a, b, x = Math.trunc(a / b)) => { //х - сколько раз b содержится в а
            if (a > b) {//защита от дурака
                if (!(a % b)) //если а делится на b без остатка
                    return a;//значит а это и есть ответ
                return (b * (x + 1) - a) < (a - b * x) ? b * x : b * (x + 1); //иначе выбираем между b * x и b * (x + 1)
            }
            return 0;
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

        function regE(text, type) {
            while (text.indexOf("  ", " ") != -1) {
                text = text.replace("  ", " ");
            }
            switch (type) {
                case 1:
                    var pattern = new RegExp(/^[0-9]+(\.[0-9]+)?$/);
                    break
                case 2:
                    var pattern = new RegExp(/^(([а-яА-Яa-zA-Z0-9ЇїІіЄєҐґ\'\"’\.№:&\/\\,;\*\«»\s)\(-]+\s?){1,})$/i);
                    break
                case 3:
                    var pattern = new RegExp(/^(([а-яА-Яa-zA-Z0-9ЇїІіЄєҐґ]+\s?){6,})$/i);
                    break
                case 4:
                    var pattern = new RegExp(/^(([а-яА-Яa-zA-Z0-9ЇїІіЄєҐґ]){6,})$/i);
                    break
                case 5:
                    var pattern = new RegExp(/^(([а-яА-Яa-zA-Z0-9ЇїІіЄєҐґ\'\"’\«».№:&,;\*)(\[\]/-]+\s?){1,})$/i);
                    break
                case 6:
                    var pattern = new RegExp(/^(([а-яА-Яa-zA-Z0-9ЇїІіЄєҐґ\.]){2,})$/i);
                    break
                default:
                    return false;
            }

            return pattern.test(text);
        }
        function sortTabulator(a, b, dictionary) {
            return getArrayStringForId(a,dictionary).localeCompare(getArrayStringForId(b,dictionary));
        };

        function getArrayStringForId(stringarrayid, dictionary) {
            return dictionary.filter(i => ((stringarrayid && stringarrayid.split) ? stringarrayid.split(',') : []).includes(i.id.toString())).map(i => i.name).join(', ');
        }

        function filterTabulator(headerValue, rowData, dictionary) {
            if (getArrayStringForId(rowData, dictionary).toLowerCase().indexOf(headerValue.toLowerCase()) > -1)
                return true;
            return false;
        }

        function gettabulator(urlload, columns, select, rowformatter, idcontainer) {
            try {
                table = new Tabulator((idcontainer? idcontainer : "#tableobj"), {
                    ajaxURL: urlload,
                    //gressiveRender : true ,
                    ajaxLoaderLoading: "<div style='display:inline-block; border:4px solid #333; border-radius:10px; background:#fff; font-weight:bold; font-size:16px; color:#000; padding:10px 20px;'>Завантаження даних</div>",
                    movableColumns: true,

                    layout: (window.outerWidth < 768 ? "fitData" : "fitColumns"), //fit columns to width of table (optional) fitColumns
                    resizableRows: true,
                    resizableColumns: "header",
                    rowFormatter: rowformatter,
                    columns: columns,
                    pagination: "local",
                    paginationSize: 20,
                    paginationSizeSelector: [20, 50, 100, 200],
                    selectable: select ? true : 1,
                    height:"100%",
                    tooltipsHeader: true,
                    tooltips: false,
                    dataTree: true,
                    dataTreeStartExpanded: true,
                    //клик по строке віделяем фичу
                    rowClick: function (e, row) { //trigger an alert message when the row is clicked
                        this.selectedRow = row.getData();
                        // this.$store.dispatch('zoomToSelectedFeature', { url: this.currentLayer.identity.geometryMethod + this.selectedRow.Id, layer: this.currentLayer, row: this.selectedRow });
                    }.bind(this),
                    locale: true,
                    langs: {
                        "uk": {
                            "ajax": {
                                "loading": "Загрузка", //ajax loader text
                                "error": "Помилка", //ajax error text
                            },
                            "pagination": {
                                "page_size": "", //label for the page size select element
                                "first": "Перша", //text for the first page button
                                "first_title": "Перша стор.", //tooltip text for the first page button
                                "last": "Остання",
                                "last_title": "Остання сторінка",
                                "prev": "Попередня",
                                "prev_title": "Попередня сторінка",
                                "next": "Наступна",
                                "next_title": "Наступна сторінка",
                            }
                        },
                    },
                });
                table.setLocale("uk");
                return table;
            }
            catch (e) {
                alert(e);
                UIkit.notification({ message: 'Помилка! Дані не були завантажені у таблицю', status: 'danger' });
            }
        }
        function openIcon(value) {
            if (value.getColumn().getDefinition().field == 'Видалити')
                return '<a  class="uk-icon-button" uk-icon="trash"></a>'
            if (value.getColumn().getDefinition().field == 'Редагувати')
                return '<a   class="uk-icon-button" uk-icon="pencil" ></a>'

             if (value.getColumn().getDefinition().field == 'arrayservices')
                return  value.getData().fileType==3 ? '<a  class="uk-icon-link" uk-icon="star" ></a>' : ''

            if (value.getColumn().getDefinition().field == 'Документи')
                return '<a  class="uk-icon-link" uk-icon="folder" ></a>'
            if (value.getColumn().getDefinition().field == 'Actual')
                return value.getData().Actual ? '<a  class="uk-icon-link" uk-icon="check" ></a>' : ''
            if (value.getColumn().getDefinition().field == 'isPay')
                return value.getData().isPay ? '<a  class="uk-icon-link" uk-icon="check" ></a>' : ''
            if (value.getColumn().getDefinition().field == '+1')
            return '<a  class="uk-icon-link" uk-icon="triangle-up" ></a>'
            if (value.getColumn().getDefinition().field == '-1')
                return '<a  class="uk-icon-link" uk-icon="triangle-down" ></a>'
            if (value.getColumn().getDefinition().field == 'Завантажити')
                return '<a  class="uk-icon-link" uk-icon="download" ></a>'
            if (value.getColumn().getDefinition().field == 'Перегляд')
                return '<a  class="uk-icon-link" uk-icon="file-text" ></a>'
            if (value.getColumn().getDefinition().field == 'status')
                return value.getData().status == 2 ? 'Виконано' : (value.getData().status == 1 ? 'В роботі' : "Очікуємо")
        }
        function deleteobject(urldelete, data, token, before, after) {
            buttonconfirm("Увага!", "Видалити без можливості відновлення?", async function func() {
            location.href = "#load";
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
					location.href = "#close";
                     UIkit.notification({ message: 'Видалено', status: 'success' });
                },
				error: function (data) {
					 switch (data.responseJSON.errorCode) {
					  case "INVALID_TOKEN":
						document.location.href = "login.html";
						break;
					case "INCORRECT LOGIN/PASSWORD":
						UIkit.notification({ message: 'Помилка у логіні або у паролі', status: 'danger'});
						break;
					case "INCORRECT CITY":
						UIkit.notification({ message: 'Помилка назви міста', status: 'danger'});
						break;
					case "INTERNAL ERROR":
						UIkit.notification({ message: 'Внутрішня помилка серверу', status: 'danger'});
						break;
					case "CANNOT TRANSLITERATE CITY NAME":
						UIkit.notification({ message: 'Неможливо перекласти назву міста', status: 'danger'});
						break;
					case "EMPTY REGISTER TITLE":
						UIkit.notification({ message: 'Заголовок порожній', status: 'danger'});
						break; 
					case "EMPTY EMAIL":
						UIkit.notification({ message: 'Електрона адреса порожня', status: 'danger'});
						break;
					case "INVALID EMAIL":
						UIkit.notification({ message: 'Помилка у електронній адресі', status: 'danger'});
						break;
					case "EMPTY PHONE NUMBER":
						UIkit.notification({ message: 'Номер телефону не внесений', status: 'danger'});
						break;                         
					case "LATITUDE OUT OF UKRAINE BOUNDARIES":
						UIkit.notification({ message: 'Координата широти знаходиться за межами України', status: 'danger'});
						break;
					case "LONGITUDE OUT OF UKRAINE BOUNDARIES" :
						UIkit.notification({ message: 'Координата довготи знаходиться за межами України', status: 'danger'});
						break;
					case "LOGIN LESS 8 SYMBOLS":
						UIkit.notification({ message: 'Логін складається меньше ніж з 8-ми символів', status: 'danger'});
						break;
					case "PASSWORD LESS 8 SYMBOLS":
						UIkit.notification({ message: 'Пароль складається меньше ніж з 8-ми символів', status: 'danger'});
						break;
					case "EMPTY RESPONSIBLE PERSON NAME":
					UIkit.notification({ message: "Им'я відповідальної особи не введено", status: 'danger'});
						break;
					case "EMPTY STREET NAME":
						UIkit.notification({ message: 'Назва вулиці порожня', status: 'danger'});
						break;
					case "EMPTY AUTHORITY NAME":
						UIkit.notification({ message: 'Порожня назва органу', status: 'danger'});
						break;
					case "EMPTY DISTRICT NAME":
						UIkit.notification({ message: 'Порожня назва району', status: 'danger'});
						break;
					case "EMPTY DECISION TITLE":
						UIkit.notification({ message: 'Назва рішення не внесена', status: 'danger'});
						break;
					case "EMPTY PHONE NUMBER":
						UIkit.notification({ message: 'Порожній номер телефону', status: 'danger'});
						break;
					case "EMPTY ADDRESS NUMBER":
						UIkit.notification({ message: 'Порожня адреса', status: 'danger'});
						break;
					case "INCORRECT ADDRESS STATUS":
						UIkit.notification({ message: 'Помилка у статусі адреси', status: 'danger'});
						break;
					case "EMPTY STREET TYPE NAME":
						UIkit.notification({ message: 'Порожній тип вулиці', status: 'danger'});
						break;
					case "EMPTY SHORT STREET TYPE NAME":
						UIkit.notification({ message: 'Порожній скорочений тип вулиці', status: 'danger'});
						break;
					case "USER ID NOT FOUND":
						UIkit.notification({ message: 'Користувач не існує', status: 'danger'});
						break;
					case "STREET ID NOT FOUND":
						UIkit.notification({ message: 'Вулиця не уснує', status: 'danger'});
						break;
					case "STREET_TYPE ID NOT FOUND":
						UIkit.notification({ message: 'Тип вулиці не існує', status: 'danger'});
						break;
					case "DISTRICT ID NOT FOUND":
						UIkit.notification({ message: 'Район не існує', status: 'danger'});
						break;
					case "AUTHORITY ID NOT FOUND":
						UIkit.notification({ message: 'Орган не існує', status: 'danger'});
						break;
					case "DECISION ID NOT FOUND":
						UIkit.notification({ message: 'Район не існує', status: 'danger'});
						break;
					case "ADDRESS ID NOT FOUND":
						UIkit.notification({ message: 'Адреса не існує', status: 'danger'});
						break;
					case "EMPTY CITY NAME":
						UIkit.notification({ message: 'Порожня назва міста', status: 'danger'});
						break;
					  default:
						UIkit.notification({ message: data.responseJSON.error , status: 'danger'});
						break;
					}
					location.href = "#close";
					
				},
            });
        });
        }
		function getCity(){
			return "kharkiv";
		}
		function Login(login, password) {
            location.href = "#load";
            $.ajax({
                url: `http://10.0.16.13:2023/portal/api/v1/register/${getCity()}/login`,
                   type: "GET",
                    data: {
						"login": login,
						"password": password
					},
                success: function (data) {
					if(data.token){
						localStorage.removeItem('token');
						localStorage.setItem('token', data.token);
						$(location).attr('href','index.html');
					}
                },
				error: function (data) {
					 switch (data.responseJSON.errorCode) {
					  case "INVALID_TOKEN":
						document.location.href = "login.html";
						break;
					case "INCORRECT LOGIN/PASSWORD":
						UIkit.notification({ message: 'Помилка у логіні або у паролі', status: 'danger'});
						break;
					case "INCORRECT CITY":
						UIkit.notification({ message: 'Помилка назви міста', status: 'danger'});
						break;
					case "INTERNAL ERROR":
						UIkit.notification({ message: 'Внутрішня помилка серверу', status: 'danger'});
						break;
					case "CANNOT TRANSLITERATE CITY NAME":
						UIkit.notification({ message: 'Неможливо перекласти назву міста', status: 'danger'});
						break;
					case "EMPTY REGISTER TITLE":
						UIkit.notification({ message: 'Заголовок порожній', status: 'danger'});
						break; 
					case "EMPTY EMAIL":
						UIkit.notification({ message: 'Електрона адреса порожня', status: 'danger'});
						break;
					case "INVALID EMAIL":
						UIkit.notification({ message: 'Помилка у електронній адресі', status: 'danger'});
						break;
					case "EMPTY PHONE NUMBER":
						UIkit.notification({ message: 'Номер телефону не внесений', status: 'danger'});
						break;                         
					case "LATITUDE OUT OF UKRAINE BOUNDARIES":
						UIkit.notification({ message: 'Координата широти знаходиться за межами України', status: 'danger'});
						break;
					case "LONGITUDE OUT OF UKRAINE BOUNDARIES" :
						UIkit.notification({ message: 'Координата довготи знаходиться за межами України', status: 'danger'});
						break;
					case "LOGIN LESS 8 SYMBOLS":
						UIkit.notification({ message: 'Логін складається меньше ніж з 8-ми символів', status: 'danger'});
						break;
					case "PASSWORD LESS 8 SYMBOLS":
						UIkit.notification({ message: 'Пароль складається меньше ніж з 8-ми символів', status: 'danger'});
						break;
					case "EMPTY RESPONSIBLE PERSON NAME":
					UIkit.notification({ message: "Им'я відповідальної особи не введено", status: 'danger'});
						break;
					case "EMPTY STREET NAME":
						UIkit.notification({ message: 'Назва вулиці порожня', status: 'danger'});
						break;
					case "EMPTY AUTHORITY NAME":
						UIkit.notification({ message: 'Порожня назва органу', status: 'danger'});
						break;
					case "EMPTY DISTRICT NAME":
						UIkit.notification({ message: 'Порожня назва району', status: 'danger'});
						break;
					case "EMPTY DECISION TITLE":
						UIkit.notification({ message: 'Назва рішення не внесена', status: 'danger'});
						break;
					case "EMPTY PHONE NUMBER":
						UIkit.notification({ message: 'Порожній номер телефону', status: 'danger'});
						break;
					case "EMPTY ADDRESS NUMBER":
						UIkit.notification({ message: 'Порожня адреса', status: 'danger'});
						break;
					case "INCORRECT ADDRESS STATUS":
						UIkit.notification({ message: 'Помилка у статусі адреси', status: 'danger'});
						break;
					case "EMPTY STREET TYPE NAME":
						UIkit.notification({ message: 'Порожній тип вулиці', status: 'danger'});
						break;
					case "EMPTY SHORT STREET TYPE NAME":
						UIkit.notification({ message: 'Порожній скорочений тип вулиці', status: 'danger'});
						break;
					case "USER ID NOT FOUND":
						UIkit.notification({ message: 'Користувач не існує', status: 'danger'});
						break;
					case "STREET ID NOT FOUND":
						UIkit.notification({ message: 'Вулиця не уснує', status: 'danger'});
						break;
					case "STREET_TYPE ID NOT FOUND":
						UIkit.notification({ message: 'Тип вулиці не існує', status: 'danger'});
						break;
					case "DISTRICT ID NOT FOUND":
						UIkit.notification({ message: 'Район не існує', status: 'danger'});
						break;
					case "AUTHORITY ID NOT FOUND":
						UIkit.notification({ message: 'Орган не існує', status: 'danger'});
						break;
					case "DECISION ID NOT FOUND":
						UIkit.notification({ message: 'Район не існує', status: 'danger'});
						break;
					case "ADDRESS ID NOT FOUND":
						UIkit.notification({ message: 'Адреса не існує', status: 'danger'});
						break;
					case "EMPTY CITY NAME":
						UIkit.notification({ message: 'Порожня назва міста', status: 'danger'});
						break;
					  default:
						UIkit.notification({ message: data.responseJSON.error , status: 'danger'});
						break;
					}
					location.href = "#close";
					
				},
            });
        }
		
		function DataObjToFormData(obj) {
			let fd = new FormData();
             var arrayname = Object.getOwnPropertyNames(obj);
            arrayname.forEach(function (rgItem) {
                fd.append(rgItem, JSON.stringify(obj[rgItem]));
            });
            return fd;
        }
		
		
		
		
        function saveobject(urlsave, data, token, type, before, after) {
            location.href = "#load";
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
						UIkit.notification({ message: 'Збережено', status: 'success' });
						break;
					  default:
						UIkit.notification({ message: data , status: 'success' });
						break;
					}
					after();
					location.href = "#close";
                },
				 error: function (data) {
					 switch (data.responseJSON.errorCode) {
					  case "INVALID_TOKEN":
						document.location.href = "login.html";
						break;
					case "INCORRECT LOGIN/PASSWORD":
						UIkit.notification({ message: 'Помилка у логіні або у паролі', status: 'danger'});
						break;
					case "INCORRECT CITY":
						UIkit.notification({ message: 'Помилка назви міста', status: 'danger'});
						break;
					case "INTERNAL ERROR":
						UIkit.notification({ message: 'Внутрішня помилка серверу', status: 'danger'});
						break;
					case "CANNOT TRANSLITERATE CITY NAME":
						UIkit.notification({ message: 'Неможливо перекласти назву міста', status: 'danger'});
						break;
					case "EMPTY REGISTER TITLE":
						UIkit.notification({ message: 'Заголовок порожній', status: 'danger'});
						break; 
					case "EMPTY EMAIL":
						UIkit.notification({ message: 'Електрона адреса порожня', status: 'danger'});
						break;
					case "INVALID EMAIL":
						UIkit.notification({ message: 'Помилка у електронній адресі', status: 'danger'});
						break;
					case "EMPTY PHONE NUMBER":
						UIkit.notification({ message: 'Номер телефону не внесений', status: 'danger'});
						break;                         
					case "LATITUDE OUT OF UKRAINE BOUNDARIES":
						UIkit.notification({ message: 'Координата широти знаходиться за межами України', status: 'danger'});
						break;
					case "LONGITUDE OUT OF UKRAINE BOUNDARIES" :
						UIkit.notification({ message: 'Координата довготи знаходиться за межами України', status: 'danger'});
						break;
					case "LOGIN LESS 8 SYMBOLS":
						UIkit.notification({ message: 'Логін складається меньше ніж з 8-ми символів', status: 'danger'});
						break;
					case "PASSWORD LESS 8 SYMBOLS":
						UIkit.notification({ message: 'Пароль складається меньше ніж з 8-ми символів', status: 'danger'});
						break;
					case "EMPTY RESPONSIBLE PERSON NAME":
					UIkit.notification({ message: "Им'я відповідальної особи не введено", status: 'danger'});
						break;
					case "EMPTY STREET NAME":
						UIkit.notification({ message: 'Назва вулиці порожня', status: 'danger'});
						break;
					case "EMPTY AUTHORITY NAME":
						UIkit.notification({ message: 'Порожня назва органу', status: 'danger'});
						break;
					case "EMPTY DISTRICT NAME":
						UIkit.notification({ message: 'Порожня назва району', status: 'danger'});
						break;
					case "EMPTY DECISION TITLE":
						UIkit.notification({ message: 'Назва рішення не внесена', status: 'danger'});
						break;
					case "EMPTY PHONE NUMBER":
						UIkit.notification({ message: 'Порожній номер телефону', status: 'danger'});
						break;
					case "EMPTY ADDRESS NUMBER":
						UIkit.notification({ message: 'Порожня адреса', status: 'danger'});
						break;
					case "INCORRECT ADDRESS STATUS":
						UIkit.notification({ message: 'Помилка у статусі адреси', status: 'danger'});
						break;
					case "EMPTY STREET TYPE NAME":
						UIkit.notification({ message: 'Порожній тип вулиці', status: 'danger'});
						break;
					case "EMPTY SHORT STREET TYPE NAME":
						UIkit.notification({ message: 'Порожній скорочений тип вулиці', status: 'danger'});
						break;
					case "USER ID NOT FOUND":
						UIkit.notification({ message: 'Користувач не існує', status: 'danger'});
						break;
					case "STREET ID NOT FOUND":
						UIkit.notification({ message: 'Вулиця не уснує', status: 'danger'});
						break;
					case "STREET_TYPE ID NOT FOUND":
						UIkit.notification({ message: 'Тип вулиці не існує', status: 'danger'});
						break;
					case "DISTRICT ID NOT FOUND":
						UIkit.notification({ message: 'Район не існує', status: 'danger'});
						break;
					case "AUTHORITY ID NOT FOUND":
						UIkit.notification({ message: 'Орган не існує', status: 'danger'});
						break;
					case "DECISION ID NOT FOUND":
						UIkit.notification({ message: 'Район не існує', status: 'danger'});
						break;
					case "ADDRESS ID NOT FOUND":
						UIkit.notification({ message: 'Адреса не існує', status: 'danger'});
						break;
					case "EMPTY CITY NAME":
						UIkit.notification({ message: 'Порожня назва міста', status: 'danger'});
						break;
					  default:
						UIkit.notification({ message: data.responseJSON.error , status: 'danger'});
						break;
					}
					location.href = "#close";
					
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
        function getobject(urlget, id, before, after, setcard) {
                location.href = "#load";
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
                        location.href = "#close";
                    },
					error: function (data) {
					 switch (data.responseJSON.errorCode) {
					  case "INVALID_TOKEN":
						document.location.href = "login.html";
						break;
					case "INCORRECT LOGIN/PASSWORD":
						UIkit.notification({ message: 'Помилка у логіні або у паролі', status: 'danger'});
						break;
					case "INCORRECT CITY":
						UIkit.notification({ message: 'Помилка назви міста', status: 'danger'});
						break;
					case "INTERNAL ERROR":
						UIkit.notification({ message: 'Внутрішня помилка серверу', status: 'danger'});
						break;
					case "CANNOT TRANSLITERATE CITY NAME":
						UIkit.notification({ message: 'Неможливо перекласти назву міста', status: 'danger'});
						break;
					case "EMPTY REGISTER TITLE":
						UIkit.notification({ message: 'Заголовок порожній', status: 'danger'});
						break; 
					case "EMPTY EMAIL":
						UIkit.notification({ message: 'Електрона адреса порожня', status: 'danger'});
						break;
					case "INVALID EMAIL":
						UIkit.notification({ message: 'Помилка у електронній адресі', status: 'danger'});
						break;
					case "EMPTY PHONE NUMBER":
						UIkit.notification({ message: 'Номер телефону не внесений', status: 'danger'});
						break;                         
					case "LATITUDE OUT OF UKRAINE BOUNDARIES":
						UIkit.notification({ message: 'Координата широти знаходиться за межами України', status: 'danger'});
						break;
					case "LONGITUDE OUT OF UKRAINE BOUNDARIES" :
						UIkit.notification({ message: 'Координата довготи знаходиться за межами України', status: 'danger'});
						break;
					case "LOGIN LESS 8 SYMBOLS":
						UIkit.notification({ message: 'Логін складається меньше ніж з 8-ми символів', status: 'danger'});
						break;
					case "PASSWORD LESS 8 SYMBOLS":
						UIkit.notification({ message: 'Пароль складається меньше ніж з 8-ми символів', status: 'danger'});
						break;
					case "EMPTY RESPONSIBLE PERSON NAME":
					UIkit.notification({ message: "Им'я відповідальної особи не введено", status: 'danger'});
						break;
					case "EMPTY STREET NAME":
						UIkit.notification({ message: 'Назва вулиці порожня', status: 'danger'});
						break;
					case "EMPTY AUTHORITY NAME":
						UIkit.notification({ message: 'Порожня назва органу', status: 'danger'});
						break;
					case "EMPTY DISTRICT NAME":
						UIkit.notification({ message: 'Порожня назва району', status: 'danger'});
						break;
					case "EMPTY DECISION TITLE":
						UIkit.notification({ message: 'Назва рішення не внесена', status: 'danger'});
						break;
					case "EMPTY PHONE NUMBER":
						UIkit.notification({ message: 'Порожній номер телефону', status: 'danger'});
						break;
					case "EMPTY ADDRESS NUMBER":
						UIkit.notification({ message: 'Порожня адреса', status: 'danger'});
						break;
					case "INCORRECT ADDRESS STATUS":
						UIkit.notification({ message: 'Помилка у статусі адреси', status: 'danger'});
						break;
					case "EMPTY STREET TYPE NAME":
						UIkit.notification({ message: 'Порожній тип вулиці', status: 'danger'});
						break;
					case "EMPTY SHORT STREET TYPE NAME":
						UIkit.notification({ message: 'Порожній скорочений тип вулиці', status: 'danger'});
						break;
					case "USER ID NOT FOUND":
						UIkit.notification({ message: 'Користувач не існує', status: 'danger'});
						break;
					case "STREET ID NOT FOUND":
						UIkit.notification({ message: 'Вулиця не уснує', status: 'danger'});
						break;
					case "STREET_TYPE ID NOT FOUND":
						UIkit.notification({ message: 'Тип вулиці не існує', status: 'danger'});
						break;
					case "DISTRICT ID NOT FOUND":
						UIkit.notification({ message: 'Район не існує', status: 'danger'});
						break;
					case "AUTHORITY ID NOT FOUND":
						UIkit.notification({ message: 'Орган не існує', status: 'danger'});
						break;
					case "DECISION ID NOT FOUND":
						UIkit.notification({ message: 'Район не існує', status: 'danger'});
						break;
					case "ADDRESS ID NOT FOUND":
						UIkit.notification({ message: 'Адреса не існує', status: 'danger'});
						break;
					case "EMPTY CITY NAME":
						UIkit.notification({ message: 'Порожня назва міста', status: 'danger'});
						break;
					  default:
						UIkit.notification({ message: data.responseJSON.error , status: 'danger'});
						break;
					}
					location.href = "#close";
					
				},
                });

        }
        function getobject_ByData(data, before , after) {
                        
                        if (!data) {
                            UIkit.notification({ message: 'Помилка', status: 'danger' });
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
                location.href = "#load";
                $.ajax({
                    url: urlget,
                    dataType: "json",
                    traditional: true,
                    data: { id: id },
                    success: function (data) {
                        location.href = "#close";
                        if (data == "ERRORDATA" || data == "ERROR") {
                            UIkit.notification({ message: 'Помилка', status: 'danger' });
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
                UIkit.notification({ message: 'Перевірте правильність введених даних', status: 'danger' });
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
                case "text": case "password": case "select-one": case "textarea": CARD[arrayname[i]] = element.value; break;
                case "date": CARD[arrayname[i]] = element.value =="" ? "/Date(12345)/" : DATEtoUTC(element.value); break;
                case "datetime-local": CARD[arrayname[i]] = element.value =="" ? "/Date(12345)/" : DATETIMEtoUTC(element.value); break;
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