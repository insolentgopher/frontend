/*METHODS*
    startMap(token) - стартует карту, token - пока не известно,
    createAddress - создать адрес с нуля,
    createStreet - создать улицу с нуля,
    modifyAddress - отредактировать геометрию адреса,
    modifyStreet - отредактировать геометрию улицы
    removeAddress - удалить адрес
    removeStreet - удалить улицу,
    selectAddress(address) - селектировать и зуммировать к адресу,
    selectStreet(street) - зуммировать к улице
    getCurrentMapExtent - текущий екстент карты
*/
/*EVENTS*
    map_singleclick - кликнули по карте, (состояние, координаты),
    map_drawend     - закончили добавление/рисование фичи 
                        (состояние, координаты, екстент для линий и полигонов, тип объекта в адресном реестре),
    map_modifyend   - закончили редактирование объекта 
                        (состояние, новые координаты, новый екстент для линий и полигонов, атрибуты и тип объекта в адресном реестре),
    map_identity - заселектрован объект для идентификации 
                        (состояние, координаты, атрибуты и тип объекта в адресном реестре)
*/
var APP_MAP = (function(){
    //DATA---------------------------------
    var 
    //map
    map,
    //switcher
    layerSwitcher,
    //layers
    layers =[],
    //map view
    view,
    //token
    token,
    //flags    
    flags = {
        identity:false,
        add: false,
        edit: false,
        delete: false,
    },
    //interactions
    select,
    modify,
    draw,
    currentGeometry,
    //draw Layer
    drawSource,
    drawLayer,
    //popup
    popupContainer,
    popupContent,
    popupCloser,
    overlay
    //--

    ;

    //FUNCTIONS==========================================================

    //FLAGS ------------------------------------------------------------------------
    //устанавливаем флаг
    function _setFlag(action){
        flags[action] = true;
    }

    //обнуляем флаги
    function _dropFlags(){
        flags.identity = false;
        flags.add = false;
        flags.edit = false;
        flags.delete = false;       
    }
    //LAYERS -------------------------------------------------------------------
    //create all layers
    function _createLayers() {
        //create basics   
        var inlayers = [], name    ;
        if (CONFIG_MAP.Map.Basics && CONFIG_MAP.Map.Basics.length > 0 ){
            CONFIG_MAP.Map.Basics.forEach(element => {
                if (element.type == 'wms' || element.type == 'wms_dyn')
                    inlayers.push(_createWMSLayer(element));
                else if (element.Name == 'OSM')
                    inlayers.push(_createOSMLayer(element));
                else
                    inlayers.push(_createTileLayer(element));
            });
            name = CONFIG_MAP.Map.layerGroups.titles.Basics;
            layers.push(_createLayersGroup(inlayers, name));
        }

        //create layers   
        inlayers = [];
        name = ''; 
        if (CONFIG_MAP.Map.Layers && CONFIG_MAP.Map.Layers.length > 0) {   
            CONFIG_MAP.Map.Layers.forEach(element => {
                var layer;
                if (element.type == 'wms'){
                    layer = _createWMSLayer(element);
                }
                if (layer)
                    inlayers.push(layer);
            });
            name = CONFIG_MAP.Map.layerGroups.titles.Layers;
            var gr = _createLayersGroup(inlayers, name);
            layers.push(gr);
        }

        //create layer for editing
        drawSource = _createSource();
        drawLayer = new ol.layer.Vector({
            source: drawSource,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
                }),
                image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
                })
            }),
            visible: true,
            name: 'drawlayer',
            zIndex: 1000
        });
        layers.push(drawLayer); 
    }

    //create layers group
    function _createLayersGroup(layers, name){
        return new ol.layer.Group({
            title: name,
            layers: layers,            
          });
    }

    //create service Tile Layer by url
    function _createTileLayer(params) {

        return new ol.layer.Tile({
            source: new ol.source.XYZ({
                attributions: params.attributions,
                attributionsCollapsible: true,
                        url: params.url,
                        zoom: params.zoom,
                        maxZoom: params.maxZoom,
                        minZoom: params.minZoom,

                    }),
            title:params.alias,
            type:params.class,
            visible: params.visible
          }); 
    }

    //create wms Tile Layer by url
    function _createWMSLayer(params){
        if (params.type == 'wms')
            return new ol.layer.Tile({
            // extent: extent,
                source: new ol.source.TileWMS({
                url: params.url,
                crossOrigin: 'anonymous',
                attributions: params.attributions,
                attributionsCollapsible: true,
                params: {
                    'LAYERS': params.layers,
                    'FORMAT': params.format,
                    'VERSION': params.version
                },
                serverType: 'mapserver',
                ratio: params.ratio ? params.ratio : '',             
                }),
                visible:params.visible,
                title:params.alias,
            });
        else
        return new ol.layer.Tile({
            // extent: extent,
                source: new ol.source.TileWMS({
                url: params.url,
                attributions: params.attributions,
                attributionsCollapsible: true,                
                params: {
                    'LAYERS': params.layers,
                    'FORMAT': params.format,
                    'VERSION': params.version,  
                    'TILED':true,
                    crossOrigin: 'Anonymous',  
                    serverType: 'QGIS',                
                },                        
                }),
                visible:params.visible,
                title:params.alias,
                type:params.class,
            });       
    }

    //create osm layer
    function _createOSMLayer(params){       
            return new ol.layer.Tile({
                source: new ol.source.OSM({
                    attributions: params.attributions,
                    attributionsCollapsible: true,
                }),
                title:params.alias,
                type:params.class,
                visible: params.visible
              });
      
    }  

    //service Layers------------------------------------------------------------

    //create layer vector source
    function _createSource(){
        return new ol.source.Vector({
            wrapX: false,
        });
    }
    
    //create layer style
    function _createStyle(params){
        return new ol.style.Style({
             zIndex: 1
        });
    }
    
    //-POPUP---------------------------------------------------------------------
    function _createPopup(){
        //элементы
        popupContainer = document.getElementById('popup');
        popupContent = document.getElementById('popup-content');
        //popupCloser = document.getElementById('popup-closer'); 
        //оверлей
        overlay = new ol.Overlay({
            element: popupContainer,
            autoPanAnimation: {
                duration: 400
            },
            stopEvent: false,
            offset: [5, -25],
            stopEvent:false
          });

        //закрытие
        // popupCloser.onclick = function() {
        //     _closePopup();
        // };
    }

    function _setContentToPopup(content){
        popupContent.innerHTML = content;
    }

    function _setPopupPosition(coordinates){
        overlay.setPosition(coordinates);
    }   

    function _closePopup(){
        overlay.setPosition(undefined);
        //popupCloser.blur();
        return false;
    }

    function _checkClickOnPopup(e){
        var res = false;
        if (e.path)
            e.path.forEach(function(epItem){
                if (epItem.classList && epItem.classList.contains('ol-popup'))
                    res = true;
            });
        return res;
    }
    //View - MAP - layerSwitcher--------------------------------------------------------------------
    //init View
    function _createView() {
        view = new ol.View({
            center: ol.proj.transform(CONFIG_MAP.Map.center, "EPSG:4326", "EPSG:3857"),
            extent: ol.proj.transformExtent(CONFIG_MAP.Map.maxExtent, 'EPSG:4326', 'EPSG:3857'),
            zoom:CONFIG_MAP.Map.view.initZoom,
            maxZoom: CONFIG_MAP.Map.view.maxZoom,
            minZoom: CONFIG_MAP.Map.view.minZoom,
            //zoomFactor: 2,
        });  

        //chek extent during change resolution
        // view.on('change:resolution', function(e){
        //     console.log(_getCurrentMapExtent());
        // });
    }

    //init Map
    function _createMap(params) {
        map = new ol.Map({
            target: CONFIG_MAP.Map.tagId,
            layers: layers,
            view: view,
            overlays: [overlay],            
        });

        //клик по карте
        map.on('singleclick', function(e){

            //identity======================================
            if (flags['identity']){  
                //if popup don't close  
                if (!_checkClickOnPopup(e.originalEvent)){
                    _closePopup();
                    drawLayer.getSource().clear();               
                }                
                //event
                _dispatchEvent(_createEvent('map_singleclick', 
                {
                    flag:'identity',
                    coordinates:e.coordinate
                }));
            }
            
            //draw address======================================
            if (flags['add'] && !_checkClickOnPopup(e.originalEvent) && currentGeometry == 'Point'){   
                //drawlayer
                _clearDrawLayer();
                var wgsCoordinate = ol.proj.transform(e.coordinate, "EPSG:3857", "EPSG:4326");
                _addFeatureToDrawLayer(_createAddressFeatureByProperties({
                    longitude: wgsCoordinate[0],
                    latitude:  wgsCoordinate[1]
                }));

                //geometry for extent
                var geometry = new ol.geom.Point(
                    e.coordinate
                );     

                //event
                _dispatchEvent(_createEvent('map_drawend', {                    
                    flag:'draw',
                    coordinates:wgsCoordinate,
                    arObjectType: 'Address',
                    extent: _createExtentByGeometry(geometry)
                }));
            }            
        });
    }

    //init layer switcher
    function _initLayerSwitcher(){
        layerSwitcher =  new ol.control.LayerSwitcher({
            tipLabel: 'Легенда', // Optional label for button
            groupSelectStyle: 'children' // Can be 'children' [default], 'group' or 'none'
          });
          map.addControl(layerSwitcher);
    }

    // - extent -------------------------------------------------------------------------
    function _zoomToExtent(extent){        
        map.getView().fit(extent,map.getSize());
        //console.log(extent);        
    }

    function _getCurrentMapExtent(){
        var extent = map.getView().calculateExtent(map.getSize());
       // console.log(extent);               
        return extent;
    }

    // - zoom -----------------------------------------------------------------------
    function _getCurrentMapZoom(){
        return map.getView().getZoom();
    }

    function _setMapZoom(zoom){
        return map.getView().setZoom(zoom);
    }
    
    // EVENTS-----------------------------------------------------------------------------------
    //createEvent
    function _createEvent(eventName, data){
        return new CustomEvent(eventName, {detail: data});
    }
    //dispatchEvent
    function _dispatchEvent(event){
        window.dispatchEvent(event);
    }

    //- INTERACTIONS ------------------------------------------------------------
    function _dropAllInteractions(){
        if (select)
            map.removeInteraction(select);
        if (modify)
            map.removeInteraction(modify);
        if (draw)
            map.removeInteraction(draw);
        select = null;
        modify = null;
        draw = null;  
    }

    function _createInteractions(geometryType){
        //select,modify,draw
        if (flags.edit || flags.identity || flags.delete ){
            select = new ol.interaction.Select({
                layers: [drawLayer],
                hitTolerance: 15,
                condition: ol.events.condition.click    
            });

            select.on('select', function(e){
                var selectedFeatures = select.getFeatures().getArray(),
                    arObjectType = (selectedFeatures.length > 0 && selectedFeatures[0].getGeometry().getType() == 'Point') ? 'address' : 'street';
                if (flags.delete){
                    var ftr = e.selected[0];                    
                    drawSource.removeFeature(ftr);  
                    select.getFeatures().clear();                  
                }
                if (flags.edit && Array.isArray(selectedFeatures) && selectedFeatures.length > 0){
                    modify = new ol.interaction.Modify({
                        source: drawSource,     
                        features:select.getFeatures()         
                    });
                    modify.on('modifyend', function(e){                        
                        _dispatchEvent(_createEvent('map_modifyend', {                    
                            flag:'edit',
                            coordinates:selectedFeatures[0].getGeometry().getCoordinates(),
                            properties: selectedFeatures[0].getProperties(),
                            arObjectType: arObjectType,
                            extent: _createExtent(selectedFeatures[0].getGeometry())
                        }));
                        select.getFeatures().clear();
                        map.removeInteraction(modify);
                        modify = null;
                    });
                    map.addInteraction(modify);
                } 
                if (flags.identity &&  selectedFeatures.length > 0){
                    var ftr = e.selected[0];                    
                    _dispatchEvent(_createEvent('map_identity', {                    
                        flag:'identity',
                        coordinates:selectedFeatures[0].getGeometry().getCoordinates(),
                        properties: selectedFeatures[0].getProperties(),
                        arObjectType: arObjectType,
                    }));       
                }
            });

            map.addInteraction(select);
        }

        if (flags.add){
            draw = new ol.interaction.Draw({
                source: drawSource,  
                type:geometryType,             
            });

            draw.on('drawend', function(e){
                var arObjectType = e.feature.getGeometry().getType() == 'Point' ? 'address' : 'street';
                _dispatchEvent(_createEvent('map_drawend', {                    
                    flag:'draw',
                    coordinates:e.feature.getGeometry().getCoordinates(),
                    arObjectType: arObjectType,
                    extent: _createExtentByGeometry(e.feature.getGeometry())
                }));
                // map.removeInteraction(draw);
                // draw = null;
            });
            map.addInteraction(draw);
        }
    }    
    
    //- Draw Layer --------------------------------------------------
    function _createStyleForDrawLayer(geometryType){
        if (geometryType == 'Point'){
          return   new ol.style.Style({
            image: new ol.style.Circle({
                radius: 25,
                fill: null,
                stroke: new ol.style.Stroke({
                    color: 'rgba(255,0,0,1)',
                    width: 2
                })
            })
        })
        }
        else  if (geometryType == 'LineString'){
          return   new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(255,0,0,1)',
                    width: 2
                })
            });
        }
        else
        return   new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
              }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255,0,0,1)',
                width: 2
            })
        });
        
        
    }

    function _updateStyleForDrawLayer(geometryType){
        drawLayer.setStyle(_createStyleForDrawLayer(geometryType));
    }

    function _addFeatureToDrawLayer(feature){
        var geometryType = (feature.longt && feature.lati) ? 'Point' : 'LineString';
            style = _createStyleForDrawLayer(geometryType);
        _clearDrawLayer();
        drawLayer.getSource().addFeature( feature );
        //drawLayer.setStyle(style);         
    }

    function _clearDrawLayer(){
        drawLayer.getSource().clear();    
    }
    //- FEATURES ------------------------------------------------------------------
    function _createAddressFeatureByProperties(properties){
        var geometryFields = CONFIG_MAP.Map.feature.drawFields['Point'];
        var geometry = new ol.geom.Point(
            ol.proj.transform([properties[geometryFields.x], properties[geometryFields.y]], "EPSG:4326", "EPSG:3857")
        );
        return new ol.Feature({
            geometry:geometry
         });
    }

    function _createExtentByGeometry(geometry){
        var geometryType = geometry.getType(),
            coordinates = geometry.getCoordinates(),
            delta = CONFIG_MAP.Map.feature.extentDelta[geometryType],
            extent = [];
        if (geometryType == 'Point'){
            extent = [coordinates[0]-delta, coordinates[1]-delta, coordinates[0]+delta, coordinates[1]+delta]
        }
        else  if (geometryType == 'LineString' || geometryType == 'Polygon'){
            var geometryExtent = geometry.getExtent();
            extent = [geometryExtent[0]-delta, geometryExtent[1]-delta, geometryExtent[2]+delta, geometryExtent[3]+delta];
        }     
        return ol.proj.transformExtent(extent, "EPSG:3857", "EPSG:4326");
    }

    function _createExtentByProperties(properties){
        var geometryType,
            coordinates,
            delta,
            fields,
            extent = [],
            outExtent = [];
        if (properties.longitude && properties.latitude){
            var outCoords = [];
            geometryType = 'Point';
            coordinates = [properties.longitude , properties.latitude];
            delta = CONFIG_MAP.Map.feature.extentDelta[geometryType];
            fields = CONFIG_MAP.Map.feature.extentFields[geometryType];
            outCoords = ol.proj.transform([properties[fields.x], properties[fields.y]], "EPSG:4326", "EPSG:3857");
            outExtent = [outCoords[0]-delta, outCoords[1]-delta,outCoords[0]+delta,outCoords[1]+delta];
        }
        else {
            geometryType = 'LineString';
            delta = CONFIG_MAP.Map.feature.extentDelta[geometryType];
            fields = CONFIG_MAP.Map.feature.extentFields[geometryType];
            var geometryExtent = [properties[fields.leftX],properties[fields.bottomY],properties[fields.rightX],properties[fields.topY]];
            extent = ol.proj.transformExtent([geometryExtent[0], geometryExtent[1], geometryExtent[2], geometryExtent[3]], ol.proj.get('EPSG:4326'), ol.proj.get('EPSG:3857'));
            outExtent = [extent[0]-delta, extent[1]-delta,extent[2]+delta,extent[3]+delta];
            //outExtent = [extent[0], extent[1],extent[2],extent[3]];
        }     
        return outExtent
    }   
    //- AR FUNCTIONS-===============================================================
    function selectAddress(address){
        var adr ={
            "addressId": 0,
            "blockNumber": "string",
            "confirmation": "string",
            "detailedAddressType": "string",
            "detailedDesc": "string",
            "detailedIndex": 0,
            "districtId": 0,
            "districtName": "string",
            "houseNumber": 0,
            "houseSuffix": "string",
            "latitude": 49.9067508695,
            "localX": 15228.574,
            "localY": 3800.833,
            "longitude": 36.2244871923,
            "postIndex": 0,
            "scans": [
              0
            ],
            "statusId": 0,
            "streetId": 0,
            "ukrStreetName": "string",
            "ukrStreetType": "string",
            "ukrStreetTypeShort": "string"
          };
        _closePopup();
        _updateStyleForDrawLayer('Point');
        _addFeatureToDrawLayer(_createAddressFeatureByProperties(address));
        _zoomToExtent(_createExtentByProperties(address));
        _setContentToPopup(address.html); 
        var prop = CONFIG_MAP.Map.feature.drawFields.Point,
            coordinates = ol.proj.transform([address[prop.x], address[prop.y]], "EPSG:4326", "EPSG:3857")
        ;
        _setPopupPosition(coordinates);
    }

    function selectStreet(street){
        var str = {
            "streetId": 7507,
            "streetTypeId": 14,
            "nameUkr": "50 років Жовтня (сел. Федірці)",
            "nameRus": "50 лет Октября (пос. Федорцы)",
            "previousOne": -1,
            "previousTwo": -1,
            "aliasOne": "",
            "aliasTwo": "",
            "leftTopX": 21945.21,
            "leftTopY": 6066.614,
            "rightBottomX": 21665.05,
            "rightBottomY": 5871.651,
            "leftTopLongitude": 36.3181169129,
            "leftTopLatitude": 49.926914738,
            "rightBottomLongitude": 36.314203945,
            "rightBottomLatitude": 49.9251725999,
            "typeNameUkr": "вулиця",
            "typeNameRus": "улица",
            "typeNameShortUkr": "вул.",
            "typeNameShortRus": "ул.",
            "valid": false
          };
        _closePopup()
        _clearDrawLayer();
        _updateStyleForDrawLayer('Point');
        _zoomToExtent(_createExtentByProperties(street));   
        //костиль из-за непоняток с екстентом
        _setMapZoom(_getCurrentMapZoom()+1);          
    }

    function createAddress(){
        //popup
        _closePopup();
        _setContentToPopup('');        
        //draw layer
        _clearDrawLayer();
        _updateStyleForDrawLayer('Point');
        //flags and interactions
        _dropFlags();
        _setFlag('add');
        _dropAllInteractions();
        currentGeometry = 'Point';
        //_createInteractions('Point', 'Address');
    }

    function createStreet(){
        _dropFlags();
        _setFlag('add');
        _dropAllInteractions();
        currentGeometry = 'LineString';
        //_createInteractions('LineString', 'Street');
    }    

    function modifyAddress(){
        _dropFlags();
        _setFlag('edit');
        _dropAllInteractions();
        _createInteractions('Address');
    }

    function modifyStreet(){
        _dropFlags();
        _setFlag('edit');
        _dropAllInteractions();
        _createInteractions('Street');
    }

    function removeAddress(){
        _dropFlags();
        _setFlag('delete');
        _dropAllInteractions();
        _createInteractions('Address');
    }

    function removeStreet(){
        _dropFlags();
        _setFlag('delete');
        _dropAllInteractions();
        _createInteractions('Street');
    }

    function identity(){
        _dropFlags();
        _setFlag('identity');
        _dropAllInteractions();
        _createInteractions();
    }
    
    function getCurrentMapExtent(){
        var currentExtent = _getCurrentMapExtent();
        return ol.proj.transformExtent(currentExtent,"EPSG:3857" , "EPSG:4326");
    }

    function refreshMap(){
        setTimeout(function(){map.updateSize();}, 100);        
    }

    function stopEditor(){
        //draw layer
        _clearDrawLayer();
        //flags and interactions
        _dropFlags();
        _setFlag('identity');
        _dropAllInteractions();
        currentGeometry = '';        
    }
    

    // !! start map !!
    function startMap(token) {
        token = token;
        //обнуляем флаги
        _dropFlags();
        //устанавливаем на идентификацию
        _setFlag('identity');
        //создаем слои
        _createLayers();
        //создаем вью
        _createView();
        //создаем попап
        _createPopup();
        //создаем карту
        _createMap();
        //создаем layerSwitcher
        _initLayerSwitcher();

        //createAddress();
        //createStreet();
        //selectAddress();
        //selectStreet();
        console.log(getCurrentMapExtent());
    }
return{
    startMap:startMap,
    createAddress:createAddress,
    createStreet:createStreet,
    modifyAddress:modifyAddress,
    modifyStreet:modifyStreet,
    removeAddress:removeAddress,
    removeStreet:removeStreet,
    identity:identity,  
    selectAddress : selectAddress,
    selectStreet :  selectStreet,
    getCurrentMapExtent: getCurrentMapExtent,
    refreshMap:refreshMap,
    stopEditor:stopEditor
}

})();