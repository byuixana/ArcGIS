require(
    ["esri/config", 
    "esri/Map", 
    "esri/views/MapView",
    "esri/layers/GraphicsLayer", 
    "esri/Graphic", 
    "esri/layers/FeatureLayer", 
    "esri/widgets/Locate", 
    "esri/widgets/Search",
    "esri/widgets/Legend"], function(esriConfig, Map, MapView, GraphicsLayer, Graphic, FeatureLayer, Locate, Search, Legend) 
    {
        // HTML <- MapView <-                   Map
        //            |                        /   \
        //         Widgets        Feature layer     Graphics layer
        //                                                 |
        //                           (Online)           Graphic
        //                          (geometry, symbol, attributes, popupTemplate)
        var myMap = new Map({
            basemap: "osm"
        })

        var myView = new MapView({
            container: "viewDiv",
            map: myMap,
            zoom: 1
        })

        var locate = new Locate({
            view: myView,
            graphic: null
        });


        var GraphicsLayer = new GraphicsLayer();
        myMap.add(GraphicsLayer);

        myView.popup.defaultPopupTemplateEnabled = true;

        myView.ui.add(locate, "top-left");

        locate.on("locate", function(event) {
            console.log("User's location:", event.position["coords"]);
        });

        if ("geolocation" in navigator)
        {
            console.log("Here")
            var postion = navigator.geolocation.getCurrentPosition(
                function(position){
                    var longitude = position.coords.latitude
                    var latitude = position.coords.longitude
                    console.log(longitude, latitude);
                    getSatellites(latitude, longitude)
                }
            ); 
        }


    async function getSatellite(objectID, latitude, longitude)
    {
        //Request all satellites from https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json
        let response = await fetch(`https://corsproxy.io/?https://api.n2yo.com/rest/v1/satellite/positions/${objectID}/${latitude}/${longitude}/0/2/?apiKey=G9HA59-MN6CFW-W7HT8M-58EZ`);     
        data = await response.json();
        console.log(data)
        var location = {
            type: "point",
            longitude: data["positions"][0]["satlatitude"],
            latitude: data["positions"][0]["satlongitude"]
        }

        var marker = {
            type: "simple-marker",
            style: "triangle"
        }
        var popup_attributes = data["info"];
        
        var popup_template = {
            title: "{satname}",
            content: "<b>Satllite</b>: {satname} ID: {satid}"
        }

        var satelliteGraphic = new Graphic({
            geometry: location,
            symbol: marker,
            attributes: popup_attributes,
            popupTemplate: popup_template
        });
        GraphicsLayer.add(satelliteGraphic)
    }

    async function getSatellites(latitude, longitude)
    {
        //Request all satellites from https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json
        let response = await fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=iridium&FORMAT=json');
        data = await response.json();
            
            data.forEach(satellite =>
                {
                    var objectID = satellite["NORAD_CAT_ID"];
                    getSatellite(objectID, latitude, longitude)
                }
            )
            
            return data;
    } 
    })

    