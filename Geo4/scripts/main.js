/***
 * Program: ArcGIS 2-D map, PROG 2056 Assignment 4
 * Author: Karlee Milbury
 * Date: 2024-04-11
 * Purpose: Create an ArcGIS 2D Web Map Application with custom client-side
   feature layer(s) and 2D widgets pertaining to a theme. Must have 2 layers (point/line and polygon), widgets, client-side rendering
 */

"use strict";

document.addEventListener("DOMContentLoaded", init);

/***
 * Initialization function
 */
function init() {
    require([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/widgets/Home",
        "esri/widgets/Locate",
        "esri/widgets/ScaleBar",
        "esri/widgets/Legend",
  
        "esri/layers/GeoJSONLayer",
        "esri/renderers/SimpleRenderer",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/PopupTemplate"
    ], function (esriConfig, Map, MapView, Home, Locate, ScaleBar, Legend,  GeoJSONLayer, SimpleRenderer, PictureMarkerSymbol, SimpleFillSymbol, PopupTemplate) {
        // use my API key
        esriConfig.apiKey = "AAPK6b8aa1941d7b447f952d32d6a5d0c0dfruPOT6IQAECOwyNTlC0wh6O0QhCxQpBfheZDhA3PZDiDf0cuc3cfe80dlXhrBo0y";
    
        /**
         * MAP CONFIG
         */

        // create the basemap
        const map = new Map({
            basemap: "arcgis/imagery"
        });
    
        // create the view
        const view = new MapView({
            map: map,
            center: [-65.640106, 44.574951],
            zoom: 16.99,
            container: "viewDiv"
        });
    
        /**
         * WIDGETS
         */
        //  locate widget
        const locate = new Locate({
            view: view,
            useHeadingEnabled: false,
            goToOverride: function (view, options) {
                options.target.scale = 1500;
                return view.goTo(options.target);
            }
        });
        view.ui.add(locate, "top-left");
    
        // home widget
        let homeWidget = new Home({
            view: view
        });
        view.ui.add(homeWidget, "top-left");
    
        // scalebar widget
        let scaleBar = new ScaleBar({
            view: view,
            unit: "metric",
            style: "ruler",
        });
        view.ui.add(scaleBar, {
            position: "bottom-left"
        });
    
      /**
       * RESTAURANT LAYER
       */

        // dining symbol for rest point
        var restSymbol = new PictureMarkerSymbol({
            url: "./icons/dining.png",
            width: "28px",
            height: "28px"
        });
    
        // renderer for restaurant layer
        var restRenderer = new SimpleRenderer({
            symbol: restSymbol
        });
    
        // Popup template for restaurant layer (just for rest names)
        var restaurantPopupTemplate = new PopupTemplate({
            title: "{Name}", 
        });

        //  GeoJSONLayer for restaurants
        var restLyr = new GeoJSONLayer({
            url: "geojsons/restaurants.geojson",
            renderer: restRenderer,
            popupTemplate: restaurantPopupTemplate 
        });

        /***
         * PICNIC LAYER
         */

        // picnic layer Renderer
        var picnicRenderer = new SimpleRenderer({
            symbol: new SimpleFillSymbol({
                color: "blue",
                outline: null
              })
        });

        // Popup template for picnics layer
        var picnicPopupTemplate = new PopupTemplate({
            title: "{Name}", 
            content: [{
                type: "fields",
                fieldInfos: [
                    {
                        fieldName: "picnicTables", 
                        label: "Picnic Tables" 
                    },
                
                ]
            }]
        });

        // Create GeoJSONLayer for picnics
        const picnicLyr = new GeoJSONLayer({
            url: "geojsons/pic.geojson",
            renderer: picnicRenderer,
            popupTemplate: picnicPopupTemplate // Assign the popup template
        });
    
        /***
         * LEGEND
         */

        //  layerInfos (its own object so it can be passed into the legend with multiple items in it)
        const legendData = [
            {
                layer: restLyr,
                title: "Restaurants"
            },
            {
                layer: picnicLyr,
                title: "Picnic Locations"
            }
        ];
    
        // add the legend to the view
        const legend = new Legend({
            view: view,
            layerInfos: legendData
        });

        // put it in the bottom right corner
        view.ui.add(legend, "bottom-right");
        
        /***
         * ADD LAYERS
         */

        // Add layers to the map
        map.addMany([picnicLyr, restLyr]);

        });
}





            