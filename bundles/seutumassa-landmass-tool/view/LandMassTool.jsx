import React, { useState, useEffect } from "react";
import '../resources/css/styles.css';
import { createGlobalStyle } from 'styled-components';
import { LocaleConsumer } from 'oskari-ui/util';
var shapefile = require("shapefile");
import GeoJSON from 'ol/format/GeoJSON';

import {getCenter} from 'ol/extent';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import { Vector as VectorSource} from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';

import moment from 'moment';

/* API */
import {
  getPersonById,
  getLandmassAreaByCoordinates,
  getLandmassDataByLandmassAreaId,
} from '../resources/api/SeutumassaLandmassToolApi.js';

import { inputFields } from '../resources/inputFields.js';

/* COMPONENTS */
import ActionSelector from './components/ActionSelector';
import StepWizard from './components/StepWizard';

const GlobalStyle = createGlobalStyle`
  body {
    cursor: ${props => {
      if(props.actionSelectorState  === 3 ){
        return 'crosshair';
      }
    }};
  }
`;

const LandMassTool = () => {
  
  const sandbox = Oskari.getSandbox();
  const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
  const map = mapModule.getMap();

  const flyoutContainer = document.getElementById('landmass-tool-container');
  flyoutContainer.style.setProperty("transition", "opacity 0.3s ease-out", "important");
  flyoutContainer.style.setProperty("font-family", "Open Sans, Arial, sans-serif", "important");
  flyoutContainer.style.setProperty("max-width", "calc(100vw - 200px)", "important");
  flyoutContainer.style.setProperty("border-radius", "10px", "important");
  flyoutContainer.style.setProperty("overflow", "hidden", "important");

  //const flyoutContent = document.getElementById('landmass-tool-content');
  const [modalContent, setModalContent] = useState(null);
  const [landmassData, setLandmassData] = useState(null);
  const [landmassDataTable, setLandmassDataTable] = useState([]);
  const [inputDefinitions, setInputDefinitions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  //const [isMapClickActive, setIsMapClickActive] = useState(false);

  const [actionSelectorState, setActionSelectorState] = useState(0);

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    switch(actionSelectorState) {
      case 0:
        map.un('click', handleMapClick);
      break;
      case 1:
        map.un('click', handleMapClick);
      break;
      case 2:
        map.un('click', handleMapClick);
      break;
      case 3:
        map.on('click', handleMapClick);
        //flyoutContainer.style.setProperty("opacity", "0.5", "important");
      break;
      case 4:
        map.un('click', handleMapClick);
      break;
    }
  }, [actionSelectorState]);

  useEffect(() => {
    setInputDefinitions(inputFields);

    const handleExtensionUpdatedEvents = () => {
      var extensionUpdatedEventsModule = {
          init: function (sandbox) {
            sandbox.registerForEventByName(this, 'userinterface.ExtensionUpdatedEvent');
          },
          getName: function () {
              return 'ExtensionUpdatedEventsModule';
          },
          onEvent: function (event) {
              if(event.getExtension().getName() === 'seutumassa-landmass-tool'){

                var viewState = event.getViewState();

                if(viewState === 'attach') {
                    flyoutContainer.style.setProperty("opacity", "1", "important");
                    sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', ['disable']);
                    sandbox.postRequestByName('WfsLayerPlugin.ActivateHighlightRequest', ['disable']);
                } else {
                    map.un('click', handleMapClick);
                    map.getLayers().forEach(layer => {
                      layer.get('name') === 'geoJSONPreview' && map.removeLayer(layer);
                    });
                    setActionSelectorState(0);
                    setCurrentStep(0);
                    handleResetLandmassTool();
                    flyoutContainer.style.setProperty("opacity", "0", "important");
                    sandbox.postRequestByName('DrawTools.StopDrawingRequest', ['newGeometry', true]);
                    sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [true]);
                    sandbox.postRequestByName('WfsLayerPlugin.ActivateHighlightRequest', [true]);
                }
              }
          }
      };
      sandbox.register(extensionUpdatedEventsModule);
    };

    handleExtensionUpdatedEvents();

  },[]);

  const handleMapRefresh = () => {
      handleClearGeoJSONPreview();
    var now = Date.now();

    Oskari.getSandbox().findAllSelectedMapLayers().forEach(layer => {
      if(layer.getLayerType() === "wms"){
        Oskari.getSandbox().postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [layer.getId(), true, {t: now}]);
      }
    });
  };

  const handleResetLandmassTool = () => {
    setActionSelectorState(0);
    setCurrentStep(0);
    setLandmassData(null);
    setLandmassDataTable([]);
    handleClearGeoJSONPreview();
  };

  const handleMapClick = (evt) => {

  //   const userRoles = [
  //     {
  //         "name": "Guest",
  //         "id": 1
  //     },
  //     {
  //       "name": "Admin",
  //       "id": 3
  //     },
  //     {
  //       "name": "HSY",
  //       "id": 4
  //     },
  //     {
  //       "name": "SeutuMaisa_Espoo",
  //       "id": 19
  //     },
  //     {
  //       "name": "SeutuMaisa_Helsinki",
  //       "id": 20
  //     },
  //     {
  //       "name": "SeutuMaisa_Vantaa",
  //       "id": 21
  //     }
  // ];

    const userRoles = Oskari.user().getRoles();
    const body = { lontitude: evt.coordinate[0], latitude: evt.coordinate[1] };
    setIsLoading(true);
    getLandmassAreaByCoordinates(body).then(response => {
      console.log(response);

      const setData = (data) => {
        setActionSelectorState(0);
        map.un('click', handleMapClick);
        if(data.hasOwnProperty('alku_pvm')){
           data.alku_pvm = data.alku_pvm !== null ? moment(data.alku_pvm) : null;
        }

        if(data.hasOwnProperty('loppu_pvm')){
          data.loppu_pvm = data.loppu_pvm !== null ? moment(data.loppu_pvm) : null;
        }

        if(data.hasOwnProperty('omistaja_id') && data.omistaja_id !== null) {
          getPersonById(data.omistaja_id).then(ownerData => {
            var newData = {...data, ...ownerData};
            setLandmassData(newData);
            setIsLoading(false);
          });
        } else {
          setLandmassData(data);
          setIsLoading(false);
        }

        if(data.hasOwnProperty('id')){
          getLandmassDataByLandmassAreaId(data.id).then(response => {
            // response && response.map((landmassData, index) => {
            //   if(landmassData.hasOwnProperty('linkit')){
            //     if(response[index].linkit === null){
            //       response[index].linkit = [];
            //     }
            //   }
            // });
            setLandmassDataTable(response);
          })
        }
      };

      const setInvalidUser = () => {
            setIsLoading(false);
            setActionSelectorState(-1);
      };


      if(!response.error && response !== undefined &&
        userRoles.some(role => role.id === 3) ||
        userRoles.some(role => role.id === 4) ||
        userRoles.some(role => role.id === 19) ||
        userRoles.some(role => role.id === 20) ||
        userRoles.some(role => role.id === 21)
        ){
        const data = response[0];
        if(data !== undefined){
          userRoles.some(role => role.id === 3) || userRoles.some(role => role.id === 4) ?
          setData(data) : userRoles.some(role => role.id === 19) && data.kunta === "049" ?
          setData(data) : userRoles.some(role => role.id === 20) && data.kunta === "091" ?
          setData(data) : userRoles.some(role => role.id === 21) && data.kunta === "092" ?
          setData(data) : setInvalidUser();
        } else {
          //setActionSelectorState(0);
          setIsLoading(false);
        }
      } else {
        setInvalidUser();
      }
    });
  };

  const handleDrawNewGeometry = (type) => {
    map.un('click', handleMapClick);
    if(type == 'Polygon'){
      setActionSelectorState(1);
    } else if(type === 'Point'){
      setActionSelectorState(2);
    }

    setLandmassDataTable([]);
    //sandbox.postRequestByName('DrawTools.StopDrawingRequest', ['newGeometry', true]);

    var drawEventModule = {
      init: function (sandbox) {
        sandbox.unregisterFromEventByName(this, 'DrawingEvent');
        sandbox.registerForEventByName(this, 'DrawingEvent');
      },
      getName: function () {
          return 'DrawEventModule';
      },
      onEvent: function (event) {
          if(event.getIsFinished() === true){
            sandbox.postRequestByName('DrawTools.StopDrawingRequest', ['newGeometry']);
            sandbox.unregisterFromEventByName(this, 'DrawingEvent');

            var geoJson = event.getGeoJson();
            var crs = geoJson.crs;
            var coordinates = [];
            var geomType;

            if(geoJson.features[0].geometry.type === 'Point'){
              geomType = 'Point';
              coordinates = geoJson.features[0].geometry.coordinates;
            } else if(geoJson.features[0].geometry.type === 'Polygon'){
              geomType = 'MultiPolygon';
              coordinates[0] = geoJson.features[0].geometry.coordinates;
            }

              var geom = {
              "crs": {
                  "type": "name",
                  "properties": {
                      "name": crs
                  }
              },
              "coordinates": coordinates,
              "type": geomType
            };

            console.log(geom);

              event.getGeoJson().features.length > 0 && setLandmassData(landmassData => {
                return { ...landmassData, geom: geom }
              });
          }
      }
    };

    sandbox.register(drawEventModule);

    Oskari.getSandbox().postRequestByName('DrawTools.StartDrawingRequest', [
            'newGeometry',
            type, // or Polygon
            {
                buffer: 200,
                allowMultipleDrawing: 'single',
                drawControl: true,
                modifyControl: true
            }]
    );
  };

  const handleSelectGeometry = () => {
    setActionSelectorState(3);
    sandbox.postRequestByName('DrawTools.StopDrawingRequest', ['newGeometry', true]);
    sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [70, true]);
  };

  const handleClearGeoJSONPreview = () => {
   map.getLayers().forEach(layer => {
      layer.get('name') === 'geoJSONPreview' && map.removeLayer(layer);
    });
  };

  const handleAddGeoJSONPreview = (geojsonObject) => {

    var image = new CircleStyle({
      radius: 5,
      fill: null,
      stroke: new Stroke({color: 'rgb(56, 182, 255)', width: 5}),
    });
    
    var styles = {
      'Point': new Style({
        image: image,
      }),
      'LineString': new Style({
        stroke: new Stroke({
          color: 'rgb(56, 182, 255)',
          width: 1,
        }),
      }),
      'MultiLineString': new Style({
        stroke: new Stroke({
          color: 'rgb(56, 182, 255)',
          width: 1,
        }),
      }),
      'MultiPoint': new Style({
        image: image,
      }),
      'MultiPolygon': new Style({
        stroke: new Stroke({
          color: 'rgb(56, 182, 255)',
          width: 1,
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 0, 0.1)',
        }),
      }),
      'Polygon': new Style({
        stroke: new Stroke({
          color: 'rgb(0, 162, 255)',
          //lineDash: [4],
          width: 3,
        }),
        fill: new Fill({
          color: 'rgba(56, 182, 255, 0.6)',
        }),
      }),
      'GeometryCollection': new Style({
        stroke: new Stroke({
          color: 'magenta',
          width: 2,
        }),
        fill: new Fill({
          color: 'magenta',
        }),
        image: new CircleStyle({
          radius: 10,
          fill: null,
          stroke: new Stroke({
            color: 'magenta',
          }),
        }),
      }),
      'Circle': new Style({
        stroke: new Stroke({
          color: 'red',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(255,0,0,0.2)',
        }),
      }),
    };
    
    var styleFunction = function (feature) {
      return styles[feature.getGeometry().getType()];
    };

      var vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(geojsonObject),
      });

      handleClearGeoJSONPreview();
      
      var vectorLayer = new VectorLayer({
        name: "geoJSONPreview",
        source: vectorSource,
        style: styleFunction,
      });

      map.addLayer(vectorLayer);
      //map.getView().fit(transformExtent(vectorSource.getExtent(), 'EPSG:3879', map.getView().getProjection()), { size: map.getSize() });

      console.log(vectorSource);

      function flyTo(location, done) {
        var duration = 4000;
        //var zoom = map.getView().getZoom();
        var parts = 2;
        var called = false;
        function callback(complete) {
          --parts;
          if (called) {
            return;
          }
          if (parts === 0 || !complete) {
            called = true;
            done(complete);
          }
        }
        map.getView().animate(
          {
            center: location,
            duration: duration,
          },
          callback
        );
        map.getView().animate(
          {
            zoom: 3,
            duration: duration / 2,
          },
          {
            zoom: 8,
            duration: duration / 2,
          },
          callback
        );
      };

      var center = getCenter(vectorSource.getExtent());

      // var hasPolygon = vectorSource.getFeatures().some(feature => feature.getGeometry().getType() === 'Polygon');
      // var hasPoint = vectorSource.getFeatures().some(feature => feature.getGeometry().getType() === 'Point');

      // var typesArray = [hasPolygon, hasPoint];


      console.log(vectorSource.getFeatures()[0].getGeometry().getType());

      // if(typesArray.filter(value => value === true).length > 1){
      //   console.log("Featurecollection contains more than one geometry types, not cool");
      // } else {
        //console.log(typesArray);
        const mergeCoordinates = vectorSource.getFeatures().map(feature => {
          //console.log(feature.getGeometry().getType());
          return feature.getGeometry().getCoordinates();
          //console.log(feature.getGeometry().getCoordinates());
        });
  
        // map.getView().animate({
        //   center: center,
        //   zoom: 5,
        //   duration: 2000,
        // });
  
        var geoJson = geojsonObject;
        var crs = {
          "type": "name",
          "properties": {
              "name": "EPSG:3879"
          }
        };
  
        //var coordinates = [];
        //var geomType = vectorSource.getFeatures()[0].getGeometry().getType();
  
        // if(vectorSource.getFeatures()[0].getGeometry().getType() === 'Point'){
        //   geomType = 'Point';
        //   coordinates = geoJson.features[0].geometry.coordinates;
        // } else if(vectorSource.getFeatures()[0].getGeometry().getType() === 'Polygon'){
        //   geomType = 'MultiPolygon';
        //   coordinates[0] = geoJson.features[0].geometry.coordinates;
        // }
  
          var geom = {
            "crs": crs,
            "coordinates": mergeCoordinates,
            "type": vectorSource.getFeatures()[0].getGeometry().getType() === 'Polygon' ? 'MultiPolygon' :
            vectorSource.getFeatures()[0].getGeometry().getType() === 'Point' && vectorSource.getFeatures().length > 1 ? 'MultiPoint' : 'Point'
          };
  
          flyTo(center, function () {
            console.log(geom);
            setTimeout(function () {
              geoJson.features.length > 0 && setLandmassData(landmassData => {
                return { ...landmassData, geom: geom }
              });
            }, 500);
          });
      //}
  };
  
  const handleDownloadShapeFile = (e) => {

    const featureCollection =  {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3879',
        },
      },
      'features': [],
    };

    setActionSelectorState(4);
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
          // console.log(e);
          // you can use this method to get file and perform respective operations
              let files = Array.from(input.files);
              setActionSelectorState(0);

              var file = files[0];
              if (!file) {
                return;
              }

              var reader = new FileReader();
              reader.onload = function(e) {
                var contents = e.target.result;
                //console.log(contents);
                shapefile.open(contents)
                .then(source => source.read()
                  .then(function log(result) {
                    if (result.done) return;
                    //console.log(result.value);
                    featureCollection.features.push(result.value);
                    //console.log(featureCollection);
                    return source.read().then(log);
                  }
                  )).then(() => {
                    console.log(featureCollection);
                    handleAddGeoJSONPreview(featureCollection);
                  })
                .catch(error => console.error(error.stack));
              };
              reader.readAsArrayBuffer(file);
          };
    input.click();

  };

  const handleSaveAndClose = (data) => {
    console.log(data);
  };
  
  
  return (
    <>
    <GlobalStyle actionSelectorState={actionSelectorState} />
    { landmassData !== null ?
      <StepWizard
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        inputDefinitions={inputDefinitions}
        landmassData={landmassData}
        setLandmassData={setLandmassData}
        landmassDataTable={landmassDataTable}
        setLandmassDataTable={setLandmassDataTable}
        //handleSaveAndAddNewLandmassData={handleSaveAndAddNewLandmassData}
        handleSaveAndClose={handleSaveAndClose}
        handleResetLandmassTool={handleResetLandmassTool}
        modalContent={modalContent}
        setModalContent={setModalContent}
        handleMapRefresh={handleMapRefresh}
      /> :
      <ActionSelector
          isLoading={isLoading}
          actionSelectorState={actionSelectorState}
          setActionSelectorState={setActionSelectorState}
          handleSelectGeometry={handleSelectGeometry}
          handleDrawNewGeometry={handleDrawNewGeometry}
          handleDownloadShapeFile={handleDownloadShapeFile}
          modalContent={modalContent}
          setModalContent={setModalContent}
      />
    }

    </>
  );
};

LandMassTool.propTypes = {
 
};

const contextWrap = LocaleConsumer(LandMassTool);
export { contextWrap as LandMassTool };