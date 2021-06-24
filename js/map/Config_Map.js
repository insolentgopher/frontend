var CONFIG_MAP = {
    Map:{
        tagId: 'map',
        Basics:[
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
                alias:'МІЦ OSM',
                url:'http://qgis.system/cgi-bin/qgis_mapserv.fcgi?MAP=/var/www/html/mongolu.qgs',
                attributions: ['<a href="http://www.infocity.kharkov.ua/" target="_blank">© МІЦ</a>'],
                layers: ['planet_osm_point','planet_osm_line','planet_osm_roads','planet_osm_line2','planet_osm_polygon'],
                zoom: 5,
                maxZoom: 23,
                minZoom: 5,
                type: 'wms_dyn',
               class:'base',
               visible: false,
            }                  
        ],
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
        layerGroups:{
            titles: {
                Basics: 'Підоснови',
                Layers: 'Шари'
            }
        },
        // center: [36.28, 49.99],
        // maxExtent: [35.0, 49.0, 38.0, 50.5],
        center: [30.541, 50.465],
        maxExtent: [22.031, 44.091, 40.323, 52.5],        
        feature:{
            extentDelta:{
                'Point': 50,
                'LineString' : 100
            },
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
            drawFields:{
                'Point':{
                    'x':'longitude',
                    'y' :'latitude'
                }
            }
        }
    },
};