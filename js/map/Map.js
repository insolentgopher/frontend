/*METHODS*
    startMap(token) - стартует карту, token - пока не известно
*/
/*EVENTS*
    map_singleclick - кликнули по карте, (состояние, координаты)
*/
var APP_MAP = (function(){
    //DATA---------------------------------
    var mapp,
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
    interactions = {
        select:null,
        modify:null,
        draw:null
    };

    //FUNCTIONS------------------------------
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
    }
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
        //create service layers        
        CONFIG_MAP.Map.ServiceLayers.forEach(element => {
            layers.push(_createServiceLayer(element));
        });
    }
    //
    function _createLayersGroup(layers, name){
        return new ol.layer.Group({
            title: name,
            layers: layers,            
          });
    }
    //create service Tile Layer
    function _createTileLayer(params) {

        return new ol.layer.Tile({
            source: new ol.source.XYZ({
                attributions: params.attributions,
                attributionsCollapsible: false,
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
    //service Layers------------------------------------------------------------
    //create service Layer
    function _createServiceLayer(params) {
        var style = _createStyle(params),
            source = _createSource(params);
        return new ol.layer.Vector({
                    source: source,
                    visible: true,
                    style: style
                });
    }

    function _createSource(params){
        return new ol.source.Vector({
            features:[],
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
            tipLabel: 'Légende', // Optional label for button
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
return{
    startMap:startMap
}

})();