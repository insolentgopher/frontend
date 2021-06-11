var CONFIG_MAP = {
    Map:{
        tagId: 'map',
        Basics:[
            {
                Id: 0,
                Name:'OSM',
                Alias:'OpenStreetMap',
                url:'https://tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png',
                attributions:['<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'],
                zoom: 12,
                maxZoom: 21,
                minZoom: 11,
                type: 'tyle',
            },
            // {
            //     Id: 1,
            //     Name:'Satelite',
            //     Alias:'World Imagery by ESRI',
            //     url:'https://tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png',
            //     attributions: ['Powered by Esri','Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
            //     zoom: 12,
            //     maxZoom: 23,
            //     minZoom: 11,
            //     type: 'tyle',
            // },            
        ],
        Layers:[],
        center: [36.28, 49.99],
        maxExtent: [35.0, 49.0, 38.0, 50.5],
    },
};