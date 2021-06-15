/*METHODS*
    startMap(token) - стартует карту, token - пока не известно,
    createAddress - создать адрес с нуля,
    createStreet - создать улицу с нуля,
    modifyAddress - отредактировать геометрию адреса,
    modifyStreet - отредактировать геометрию улицы
*/
/*EVENTS*
    map_singleclick - кликнули по карте, (состояние, координаты),
    map_drawend     - закончили добавление/рисование фичи 
                        (состояние, координаты, тип объекта в адресном реестре),
    map_modifyend   - закончили редактирование объекта 
                        (состояние, новые координаты, тип объекта в адресном реестре),
*/
var APP_MAP = (function(){
    //DATA---------------------------------
    var map,
    layerSwitcher,
    layers =[],
    view,
    token,
    flags = {
        identity:false,
        add: false,
        edit: false,
        delete: false,
    },
    select,
    modify,
    draw,

    drawSource,
    drawLayer;

    //FUNCTIONS------------------------------

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
        CONFIG_MAP.Map.Basics.forEach(element => {
            inlayers.push(_createTileLayer(element));
        });
        name = CONFIG_MAP.Map.layerGroups.titles.Basics;
        layers.push(_createLayersGroup(inlayers, name));
        //create layers   
        inlayers = [];
        name = '';     
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
        //layer for editing
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
    //
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

    function _createWMSLayer(params){
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
    }
    //service Layers------------------------------------------------------------
    //create service Layer
    function _createServiceLayer(params) {
        var style = _createStyle(params),
            source = _createSource(params);
        return new ol.layer.Vector({
                    source: source,
                    zIndex: 1000
                   // visible: true,
                    // style: style
                });
    }

    function _createSource(){
        return new ol.source.Vector({
            wrapX: false,
        });
    }

    function _createStyle(params){
        return new ol.style.Style({
             zIndex: 1
        });
    }
    
    //View - MAP - layerSwitcher--------------------------------------------------------------------
    //init View
    function _createView() {
        view = new ol.View({
            center: ol.proj.transform(CONFIG_MAP.Map.center, "EPSG:4326", "EPSG:3857"),
            extent: ol.proj.transformExtent(CONFIG_MAP.Map.maxExtent, 'EPSG:4326', 'EPSG:3857'),
            zoom: 12,
            maxZoom: 21,
            minZoom: 11,
        });  
    }

    //init Map
    function _createMap(params) {
        map = new ol.Map({
            target: CONFIG_MAP.Map.tagId,
            layers: layers,
            view: view
        });

        //клик по карте
        map.on('singleclick', function(e){
            if (flags['identity']){
                _dispatchEvent(_createEvent('map_singleclick', 
                {
                    flag:'identity',
                    coordinates:e.coordinate
                }));
            }
        });

    }
    
    function _initLayerSwitcher(){
        layerSwitcher =  new ol.control.LayerSwitcher({
            tipLabel: 'Легенда', // Optional label for button
            groupSelectStyle: 'children' // Can be 'children' [default], 'group' or 'none'
          });
          map.addControl(layerSwitcher);
          
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

    function _createInteractions(geometryType, arObjectType){
        //select,modify,draw
        if (flags.edit || flags.identity || flags.delete ){
            select = new ol.interaction.Select({
                layers: [drawLayer],
                hitTolerance: 15,
                condition: ol.events.condition.click    
            });

            select.on('select', function(e){
                var selectedFeatures = select.getFeatures().getArray();
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
                        var arObjectType = select.getFeatures().getArray()[0].getGeometry().getType() == 'Point' ? 'address' : 'street';
                        _dispatchEvent(_createEvent('map_modifyend', {                    
                            flag:'edit',
                            coordinates:select.getFeatures().getArray()[0].getGeometry().getCoordinates(),
                            properties: select.getFeatures().getArray()[0].getProperties(),
                            arObjectType: arObjectType,
                        }));
                        select.getFeatures().clear();
                        map.removeInteraction(modify);
                        modify = null;
                    });
                    map.addInteraction(modify);
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
                }));
            });
            map.addInteraction(draw);
        }
  
        

    }

    
    //-AR -----------------------------------------------------------------------
    function createAddress(){
        _dropFlags();
        _setFlag('add');
        _dropAllInteractions();
        _createInteractions('Point', 'Address');
    }

    function createStreet(){
        _dropFlags();
        _setFlag('add');
        _dropAllInteractions();
        _createInteractions('LineString', 'Street');
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
    //стартуем карту
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
        //создаем карту
        _createMap();
        //создаем layerSwitcher
        _initLayerSwitcher();

        //createAddress();
        //createStreet();
    }
return{
    startMap:startMap,
    createAddress:createAddress,
    createStreet:createStreet,
    modifyAddress:modifyAddress,
    modifyStreet:modifyStreet,
    removeAddress:removeAddress,
    removeStreet:removeStreet
}

})();