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

        var GraphicsLayer = new GraphicsLayer();
        myMap.add(GraphicsLayer);

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200)
            {
                var data = JSON.parse(this.responseText);
                console.log(data)
                for (feature of data.features)
                {
                    var location = {
                        type: "point",
                        longitude: feature.geometry.coordinates[0],
                        latitude: feature.geometry.coordinates[1]
                    }
                    
                    var mag_color;
                    var mag = feature.properties.mag;
                    if (mag > 4){
                        mag_color = [168, 78, 50]; //Red
                    }
                    else if (mag > 2)
                    {
                        mag_color = [247, 241, 54] //yellow
                    }
                    else{
                        mag_color = [50, 54, 168] //Blue
                    }

                    var marker = {
                        type: "simple-marker",
                        style: "triangle",
                        color: mag_color
                    }

                    var popup_attributes = feature.properties;
                    console.log(feature.properties)
                    var popup_template = {
                        title: "Earthquake",
                        content: "<b>Mag</b>: {mag} Location: {place}"
                    }

                    var graphic = new Graphic({
                        geometry: location,
                        symbol: marker,
                        attributes: popup_attributes,
                        popupTemplate: popup_template
                    });
                    GraphicsLayer.add(graphic)
                }  
            }
           
        }
        xmlhttp.open("GET", "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson");
        xmlhttp.send();

        myView.popup.defaultPopupTemplateEnabled = true;

        var volcanoLayer = new FeatureLayer({
            url:"https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/test_Significant_Global_Volcanic_Eruptions_1/FeatureServer"
        })
        var faultLayer = new FeatureLayer({
            url:"https://services.arcgis.com/nzS0F0zdNLvs7nc8/arcgis/rest/services/Sean_View_6/FeatureServer"
        })
        
        myMap.add(volcanoLayer);
        myMap.add(faultLayer);

        var locate = new Locate({
            view: myView,
            useHeadingEnabled: false,
            goToOverride: function(view, options) {
                options.target.scale = 1000000;
                return view.goTo(options.target);
            }
            
        })

        myView.ui.add(locate, "top-left");

        var search = new Search({
            view: myView
        });

        myView.ui.add(search, "top-right");

        var legend = new Legend({
            view: myView,
            layerInfos:[{
                layer: volcanoLayer,
                title:"Volcano Layer"
            }, 
            {
                layer: faultLayer,
                title:"Fault Layer"
            }]
        });

        myView.ui.add(legend, "bottom-left");
    }
);