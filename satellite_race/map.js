require(
    ["esri/config", 
    "esri/Map", 
    "esri/views/MapView",
    "esri/layers/GraphicsLayer", 
    "esri/Graphic", 
    "esri/layers/FeatureLayer", 
    "esri/widgets/Locate", 
    "esri/Camera",
    "esri/widgets/Search",
    "esri/widgets/Legend",
    ], function(esriConfig, Map, MapView, GraphicsLayer, Graphic, FeatureLayer, Locate, Search, Legend, Camera) 
    {
        // HTML <- MapView <-                   Map
        //            |                        /   \
        //         Widgets        Feature layer     Graphics layer
        //                                                 |
        //                           (Online)           Graphic
        //                          (geometry, symbol, attributes, popupTemplate)
        
        //Create symbol map
        var satelliteMap = new Map({
            basemap: "satellite"
        })

        var satelliteView = new MapView({
            container: "worldDiv",
            map: satelliteMap,
            zoom: 1
        })

        var SatelliteGraphicsLayer = new GraphicsLayer();

        satelliteMap.add(SatelliteGraphicsLayer);

        async function getSatellites()
        {
            //Request all satellites from https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json
            let response = await fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=json');
            data = await response.json();
            console.log(data);
            return data;
        }

        getSatellites();

        // var xmlhttp = new XMLHttpRequest();
        // xmlhttp.onreadystatechange = function() 
        // {
        //     if (this.readyState == 4 && this.status == 200)
        //     {
        //         var data = JSON.parse(this.responseText);
        //         console.log(data)
        //         for (feature of data.features)
        //         {
        //             var location = {
        //                 type: "point",
        //                 longitude: feature.geometry.coordinates[0],
        //                 latitude: feature.geometry.coordinates[1]
                        
        //             }
                    
        //             var mag_color;
        //             var mag = feature.properties.mag;
        //             if (mag > 4){
        //                 mag_color = [168, 78, 50]; //Red
        //             }
        //             else if (mag > 2)
        //             {
        //                 mag_color = [247, 241, 54] //yellow
        //             }
        //             else{
        //                 mag_color = [50, 54, 168] //Blue
        //             }

        //             var marker = {
        //                 type: "simple-marker",
        //                 style: "triangle",
        //                 color: mag_color
        //             }

        //             var popup_attributes = feature.properties;

        //             var popup_template = {
        //                 title: "Earthquake",
        //                 content: "<b>Mag</b>: {mag} Location: {place}"
        //             }

        //             var graphic = new Graphic({
        //                 geometry: location,
        //                 symbol: marker,
        //                 attributes: popup_attributes,
        //                 popupTemplate: popup_template
        //             });
        //             GraphicsLayer.add(graphic)
        //         }  
        //     }
           
        // }

        // var graphic = new Graphic({
        //     geometry: location,
        //     symbol: marker,
        //     attributes: popup_attributes,
        //     popupTemplate: popup_template
        // });


        // //G9HA59-MN6CFW-W7HT8M-58EZ
        // GraphicsLayer.add(graphic)
        // xmlhttp.open("GET", "https://api.n2yo.com/rest/v1/satellite/tle/25544&apiKey=G9HA59-MN6CFW-W7HT8M-58EZ");
        // xmlhttp.send();
    }  
    
);

/*
position_function <- function(station_names)
{

  for(name in station_names)
  {
    
    mean_motion <- ss_dataset$MEAN_MOTION[ss_dataset$OBJECT_NAME == name]

    eccentricity <- ss_dataset$ECCENTRICITY[ss_dataset$OBJECT_NAME == name]

    mean_anomaly <- ss_dataset$MEAN_ANOMALY[ss_dataset$OBJECT_NAME == name]

    ascending_node <- ss_dataset$RA_OF_ASC_NODE[ss_dataset$OBJECT_NAME == name]

    e_old <- mean_anomaly #degrees/radians
    e_new <- 0

    while (abs(e_new - e_old) >= (1 * 10**-4))
    {
      #Enew=M+e⋅sin(E old)
      e_new = e_old - (e_old - eccentricity*sin(e_old) - mean_anomaly) / (1 - eccentricity * cos(e_old))
      e_old = e_new
    }
    eccentric_anomaly <- e_old

  # true_anomaly is ν = arctan2(sqrt(1 - e^2) * sin(E), cos(E) - e)
    true_anomaly = atan2(sqrt(1 - eccentricity^2) * sin(eccentric_anomaly), cos(eccentric_anomaly) - eccentricity)

    a = (9.81 / mean_motion^2)^(1/3)

    periapsis <- ascending_node - true_anomaly
    # position <- a * (1 - eccentricity^2) / (1 + eccentricity * cos(true_anomaly))
    radial_distance <- 1 + eccentricity * cos(true_anomaly - periapsis) / 1 - eccentricity**2

    #Appends to vectors
    positions$radial_distances <- append(positions$radial_distances, radial_distance)
    positions$true_anomalies <- append(positions$true_anomalies, true_anomaly)

  }
  return(positions)
}
*/

        //How to alters the view in a 3D map
        // var satelliteCamera = new Camera({
        //     heading: 90, // face due east
        //     tilt: 45, // looking from a bird's eye view
        //     position: [ -122, 38, 20000 ],  // creates a point instance (x,y,z)
        //     position: {
        //         latitude: 38,
        //         longitude: -122,
        //         spatialReference: { wkid: 3857 }
        //       }
        // })