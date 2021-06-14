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
                zoom: 12,
                maxZoom: 21,
                minZoom: 11,
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
                zoom: 12,
                maxZoom: 23,
                minZoom: 11,
                type: 'tile',
               class:'base',
               visible: false,
            },            
        ],
        Layers:[],
        ServiceLayers:[
            {
                Id: 'sl0',
                Name:'sl_point',
                geometryType: 'Point',
            },
            {
                Id: 'sl1',
                Name:'sl_line',
                geometryType: 'Line',
            },
            // {
            //     Id: 'sl2',
            //     Name:'sl_polygon',
            //     geometryType: 'Polygon',
            // },
        ],
        layerGroups:{
            titles: {
                Basics: 'Підоснови',
                Layers: 'Шари реєстра'
            }
        },
        center: [36.28, 49.99],
        maxExtent: [35.0, 49.0, 38.0, 50.5],
    },
};