var CONFIG_MAP = {
    Map:{
        //id тега, где будет разворачиваться карта
        tagId: 'map',
        //подложки
        Basics:[
            //осм
            {
                Id: 'b0',
                Name:'OSM',
                alias:'OpenStreetMap',
                url:'https://tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png',
                attributions:['<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'],
                zoom: 5,
                maxZoom: 21,
                minZoom: 5,
                type: 'tile',
                class:'base',
                visible: true,
            },
            //космо есри
            {
                Id: 'b1',
                Name:'Satelite',
                alias:'World Imagery by ESRI',
                url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                attributions: ['Powered by Esri','Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
                zoom: 5,
                maxZoom: 23,
                minZoom: 5,
                type: 'tile',
               class:'base',
               visible: false,
            },
            {
                Id: 'b2',
                Name:'custom_OSM',
                alias:'Локальний OSM',
                url:'http://qgis.system/cgi-bin/qgis_mapserv.fcgi?MAP=/var/www/html/mongolu.qgs',
                attributions: ['<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'],
                layers: ['planet_osm_polygon','planet_osm_line','planet_osm_roads','planet_osm_line2','planet_osm_point'],
                zoom: 5,
                maxZoom: 23,
                minZoom: 5,
                type: 'wms_dyn',
               class:'base',
               visible: false,
            }                  
        ],
        //слои
        Layers:[
            {
                Id: 'l0',
                Name:'Kadmap',
                alias:'Кадастрова карта',
                url:'https://m1.land.gov.ua/geowebcache/service/wms',
                attributions: ['<a href="http://dzk.gov.ua/" target="_blank">© ЦДЗК Всі права захищені. </a>'],
                layers:'kadastr',
                format: 'image/png',
                width: '256',
                height: '256',
                version: '1.1.1',
                srs: 'EPSG:3857',
                ratio: 1,
                zoom: 5,
                maxZoom: 23,
                minZoom: 5,
                type: 'wms',
                class:'',
                visible: false,
            } 
        ],
        //настройки для групп слоев
        layerGroups:{
            titles: {
                Basics: 'Підоснови',
                Layers: 'Шари'
            }
        },
        // center: [36.28, 49.99],        
        // maxExtent: [35.0, 49.0, 38.0, 50.5],
        //центр карты
        center: [30.541, 50.465],
        //максимальный екстент, инициализируется при входе в город
        maxExtent: [22.031, 44.091, 40.323, 52.5],        
        //настройки вью
        view:{
            minZoom:8,
            maxZoom:21,
            initZoom:9,
        },
        //настройки для объектов
        feature:{
            //дельты для екстентов по типам геометрии
            extentDelta:{
                'Point': 50,
                'LineString' : 100
            },
            //названия полей для построения екстентов
            extentFields:{
                'Point': {
                    'x':'longitude',
                    'y' :'latitude'
                },
                'LineString' : {
                    'leftX':'leftBottomLongitude',
                    'bottomY' :'leftBottomLatitude',                    
                    'rightX':'rightTopLongitude',
                    'topY' :'rightTopLatitude',
                }               
            },
            //названия полей где хранится геометрия
            drawFields:{
                'Point':{
                    'x':'longitude',
                    'y' :'latitude'
                }
            }
        }
    },
};