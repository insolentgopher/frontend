var _tableDocument;
var newDocument=[];
var oldDocument=[];
var DocumentTypeDATA=null ; var AuthorityDATA = null;
var STATUSES = [{id: 0 , name : 'Дійсний' },{id: 1 , name : 'Анульований' },{id: 2 , name : 'Зі змінами' }];
		 var columnsDocument = [
			{
                    title: 'Тип',
                    field: 'documentTypeId',
                    sorter: "string",
					minWidth: 60,
                   formatter: function(value){
						return DocumentTypeDATA.find(a => a.id == value.getData().documentTypeId) ? DocumentTypeDATA.find(a => a.id == value.getData().documentTypeId).typeName : '' ;
					},
					headerFilter:true,
                    headerFilterPlaceholder: 'Пошук...',
                    sorter: function (a, b) {
                    return sortTabulator(a, b, DocumentTypeDATA.map(function (a) { return { id: a.id, name: a.typeName }; }));
					},
					headerFilterFunc: function (headerValue, rowData) {
						return filterTabulator(headerValue, (rowData!=undefined && rowData!=null  ? rowData.toString() : ''), DocumentTypeDATA.map(function (a) { return { id: a.id, name: a.typeName }; }));
					}
            },
             {
                    title: 'Номер',
					minWidth: 100,
					hozAlign:"center",
                    field: 'number',
                    sorter: "string",
                    headerFilter:true,
					
                headerFilterPlaceholder: 'Пошук...',
            },
			{
                    title: 'Дата ',
					minWidth: 300,
					hozAlign:"center",
                    field: 'issued',
                    sorter: "number",
					
					headerFilter:minMaxFilterEditor, 
					headerFilterFunc:minMaxFilterFunction, 
					headerFilterLiveFilter:false,
					
				formatter: function(value){
						return getdate2(value.getData().issued);
					},
				
            },
			{
                    title: 'Заголовок',
					minWidth: 100,
                    field: 'title',
                    sorter: "string",
                    headerFilter:true,
                headerFilterPlaceholder: 'Пошук...',
            },
            {
                    title: 'Видавник',
					minWidth: 100,
                    field: 'authorityId',
                    sorter: "string",
                    formatter: function(value){
						return AuthorityDATA.find(a => a.id == value.getData().authorityId) ? AuthorityDATA.find(a => a.id == value.getData().authorityId).name : '' ;
					},
					headerFilter:true,
                    headerFilterPlaceholder: 'Пошук...',
                    sorter: function (a, b) {
                    return sortTabulator(a, b, AuthorityDATA.map(function (a) { return { id: a.id, name: a.name }; }));
					},
					headerFilterFunc: function (headerValue, rowData) {
						return filterTabulator(headerValue, (rowData!=undefined && rowData!=null  ? rowData.toString() : ''), AuthorityDATA.map(function (a) { return { id: a.id, name: a.name }; }));
					}
            },
			{
                    title: 'Заявник',
					minWidth: 100,
                    field: 'applicantName',
                    sorter: "string",
					headerFilter:true,
                    headerFilterPlaceholder: 'Пошук...',
                    formatter: function(value){
						return value.getData().applicantName +'<br> ' +  value.getData().applicantCode;
					},
					
            },
            {
                    title: 'Статус',
					minWidth: 100,
                    field: 'status',
                    sorter: "string",
					formatter: function(value){
						return STATUSES.find(a => a.id == value.getData().status) ? STATUSES.find(a => a.id == value.getData().status).name : '' ;
					},
					headerFilter:true,
                    headerFilterPlaceholder: 'Пошук...',
                    sorter: function (a, b) {
                    return sortTabulator(a, b, STATUSES.map(function (a) { return { id: a.id, name: a.name }; }));
					},
					headerFilterFunc: function (headerValue, rowData) {
						return filterTabulator(headerValue, (rowData!=undefined && rowData!=null  ? rowData.toString() : ''), STATUSES.map(function (a) { return { id: a.id, name: a.name }; }));
					}
            },
			{
                    title: '',
                    field: 'Завантажити',
                    sortable:false,
                    formatter: openIcon,
                    headerSort:false,
                    resizable:false,
                    width: 50,
                    align:"center",
                    cellClick: function (e, cell) {
                      window.open(cell.getData().documentUrl , '_blank');
                }
            },
        ];
		
		
		
		
		
		function GETSELECTED()
		{
			
			return _tableDocument.getSelectedData();
		}
		
		function UNSELECT()
		{
			_tableDocument.deselectRow();
		}
		
		function SETDataTableDoc(data)
		{
			
			_tableDocument.replaceData(data); 
		}
		
		function OpenDocModal(x){
			if(_tableDocument.getData().length==0 && !x){
				LoadDataTableDoc();
				return;
			}
			_tableDocument.redraw();
			UNSELECT();
			
			showModal('modalCardGETDOC');
		}
		
		async function GETDOCUMENTFROMDB(entity, id){
			oldDocument=[];
			newDocument=[];
			$('#tbodyDocuments').empty();
			if(id > 0){
			$('#load').removeClass("hide-loader");
			let d = await axios.get(MainURL + getCity()+'/'+entity+'/'+id+'/document').catch(error => {GETERROR(error); $('#load').addClass("hide-loader");});
			
			if(!DocumentTypeDATA  || !AuthorityDATA){
			const yy = await axios.get(MainURL + getCity()+"/documenttype").catch(error => {GETERROR(error); $('#load').addClass("hide-loader");});
				DocumentTypeDATA =  yy.data;
				
			const zz = await axios.get(MainURL + getCity()+"/authority").catch(error => {GETERROR(error); $('#load').addClass("hide-loader");});
			AuthorityDATA= zz.data;
			}
			let r = d.data;
			
			d.data.forEach(function (Item) {
				$('#tbodyDocuments').append(`<tr id='doc-${Item.id}'>
		<td>${DocumentTypeDATA.find(a=> a.id ==Item.documentTypeId) ?  DocumentTypeDATA.find(a=> a.id ==Item.documentTypeId).typeName : ""} ${AuthorityDATA.find(a=> a.id ==Item.authorityId) ?  AuthorityDATA.find(a=> a.id ==Item.authorityId).nameInGenitiveCase : ""} № ${Item.number} від ${getdate2(Item.issued)}р.</td>
										<td class="uk-text-nowrap uk-preserve-width">
										<a class="uk-margin-small-right" onclick="window.open('${Item.documentUrl}' , '_blank');" uk-icon="download"></a>
											<a class="uk-margin-small-right" onclick='addUnlinkDoc(${Item.id})' uk-icon="trash"></a>
										</td></tr>`);
			});
			$('#load').addClass("hide-loader");
		}
		}
		
		function SELECTDOC(){
			let t = GETSELECTED();
			t.forEach(function (Item) {
				if(newDocument.indexOf(Item.id) > -1){
					UIkit.notification({ message: 'Документ вже був доданий', status: 'warning' });
				}
				else{
				newDocument.push(Item.id);
				$('#tbodyDocuments').append(`<tr id='doc${Item.id}'>
		<td>${DocumentTypeDATA.find(a=> a.id ==Item.documentTypeId) ?  DocumentTypeDATA.find(a=> a.id ==Item.documentTypeId).typeName : ""} ${AuthorityDATA.find(a=> a.id ==Item.authorityId) ?  AuthorityDATA.find(a=> a.id ==Item.authorityId).nameInGenitiveCase : ""} № ${Item.number} від ${getdate2(Item.issued)}р.</td>
										<td class="uk-text-nowrap uk-preserve-width">
											<a class="uk-margin-small-right" onclick='removeLinkFromArray(${Item.id})' uk-icon="trash"></a>
										</td></tr>`);
				}
			});
			hideModal('modalCardGETDOC');
		
		}
		function removeLinkFromArray(id)
		{
			const index = newDocument.indexOf(id);
			if (index > -1) {
			  newDocument.splice(index, 1);
			}

			$("#tbodyDocuments tr#doc"+id).remove();
			
		}
		
		function addUnlinkDoc(id)
		{
			oldDocument.push(id);
			$("#tbodyDocuments tr#doc-"+id).remove();
			
		}
		
		function getlinksunlinks(){
			let arr = [];
			oldDocument.forEach(function (Item) { arr.push({action: 1, documentId: Item});});
			newDocument.forEach(function (Item) { arr.push({action: 0, documentId: Item});});
			return arr;
		}
		function getlinksunlinkswithSeparator(){
			let s = '';
			oldDocument.forEach(function (Item) { s+= `1,${Item};`;});
			newDocument.forEach(function (Item) { s+= `0,${Item};`;});
			return s;
		}
		
		async function LoadDataTableDoc(){
			$('#load').removeClass("hide-loader");
			
			const yy = await axios.get(MainURL + getCity()+"/documenttype").catch(error => {GETERROR(error); $('#load').addClass("hide-loader");});
			DocumentTypeDATA =  yy.data;
				
			const zz = await axios.get(MainURL + getCity()+"/authority").catch(error => {GETERROR(error); $('#load').addClass("hide-loader");});
			AuthorityDATA= zz.data;
				
			const x = await axios.get(MainURL + getCity() + '/document').catch(error => {GETERROR(error); $('#load').addClass("hide-loader");});
			SETDataTableDoc(x.data);
			
			OpenDocModal(true);
			$('#load').addClass("hide-loader");
		}
		
		
		function transferal(namediv){
			
			let content = $('#divattDoc').detach();
			content.appendTo('#'+namediv);
		
		}
		