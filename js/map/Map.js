/*FIRES*
    startMap(token) - стартует карту, token - пока не известно
*/
/*EVENTS*
    map_singleclick - кликнули по карте, (состояние, координаты)
*/
var APP_MAP = (function(){
    var map,
    layers =[],
    view,
    token,
    flags = {
        identity:false,
        add: false,
        edit: false,
        delete: false,
    };

    //стартуем карту
    function startMap(token) {
        token = token;
        //обнуляем флаги
        _initFlags();
        //устанавливаем на идентификацию
        _setFlag('identity');
        //создаем слои
        _createLayers();
        //создаем вью
        _createView();
        //создаем карту
        _createMap();
    }

    //устанавливаем флаг
    function _setFlag(action){
        flags[action] = true;
    }

    //обнуляем флаги
    function _initFlags(){
        flags.identity = false;
        flags.identity = false;
        flags.identity = false;
        flags.identity = false;       
    }

    //create all layers
    function _createLayers() {
        //create basics        
        CONFIG_MAP.Map.Basics.forEach(element => {
            layers.push(_createTileLayer(element));
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
                    })
          }); 
    }

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
        var map = new ol.Map({
            target: CONFIG_MAP.Map.tagId,
            layers: layers,
            view: view
        });

        //клик по карте
        map.on('singleclick', function(e){
            var event;
            if (flags['identity']){
                _dispatchEvent(_createEvent('map_singleclick', 
                {
                    flag:'identity',
                    coordinates:e.coordinate
                }));
            }
        });

    }
    
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