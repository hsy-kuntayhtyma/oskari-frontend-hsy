import React, { useState, useEffect } from "react";
import '../resources/css/styles.css';
import { createGlobalStyle } from 'styled-components';
import { LocaleConsumer } from 'oskari-ui/util';
import { Modal, Table } from 'antd';
var shapefile = require("shapefile");
import GeoJSON from 'ol/format/GeoJSON';

import {getCenter} from 'ol/extent';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import { Vector as VectorSource} from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';

import moment from 'moment';

/* API */
import {
  getLandmassConfig,
  getLandmassAreaByCoordinate
} from '../resources/api/SeutumassaLandmassApi.js';

/* COMPONENTS */
import ActionSelector from './components/ActionSelector';
import StepWizard from './components/StepWizard';
import ProjectManager from './components/ProjectManager.jsx';

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

  const [config, setConfig] = useState();

  const [preSelectedLandmassAreas, setPreSelectedLandmassAreas] = useState();
  const [preSelectedLandmassAreaId, setPreSelectedLandmassAreaId] = useState();

  const [selectedLandmassArea, setSelectedLandmassArea] = useState();
  const [actionSelectorState, setActionSelectorState] = useState(0);

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
      break;
      case 4:
        map.un('click', handleMapClick);
      break;
      case 5:
        map.un('click', handleMapClick);
      break;
    }
  }, [actionSelectorState]);

  useEffect(() => {
    getLandmassConfig()
      .then(r => r.json())
      .then(setConfig);
  }, []);

  useEffect(() => {
    setPreSelectedLandmassAreaId(preSelectedLandmassAreas?.[0].id);
  }, [preSelectedLandmassAreas]);

  const doSetSelectedLandmassArea = (area) => {
    if (area.hasOwnProperty('geom') && !!area.geom && typeof(area.geom) === "string") {
      // Convert stringified GeoJSON to object when reading
      area.geom = JSON.parse(area.geom);
    }
    if (!area.hankealue_id) {
      area.hankealue_id = -1;
    }
    if (area.hasOwnProperty('alku_pvm') && !!area.alku_pvm) {
      area.alku_pvm = moment(area.alku_pvm);
    }
    if (area.hasOwnProperty('loppu_pvm') && !!area.loppu_pvm) {
      area.loppu_pvm = moment(area.loppu_pvm);
    }
    setSelectedLandmassArea(area);
  };

  useEffect(() => {
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
    setSelectedLandmassArea(null);
    handleClearGeoJSONPreview();
  };

  const handleMapClick = async (evt) => {
    const lon = evt.coordinate[0];
    const lat = evt.coordinate[1];
    const response = await getLandmassAreaByCoordinate(lon, lat);
    if (!response.ok) {
      if (response.status === 403) {
        setActionSelectorState(-1);
      }
      return;
    }
    const areas = await response.json();
    if (!areas || !areas.length) {
      return;
    }
    if (areas.length === 1) {
      setActionSelectorState(0);
      doSetSelectedLandmassArea(areas[0]);
    } else {
      setPreSelectedLandmassAreas(areas);
    }
  };

  const handleDrawNewPoint = () => handleDrawNewGeometry('Point');
  const handleDrawNewArea = () => handleDrawNewGeometry('Polygon');

  const handleDrawNewGeometry = (geomType) => {
    const requestId = 'newGeometry';

    const actionState = geomType == 'Polygon' ? 1 : 2;
    setActionSelectorState(actionState);
    setSelectedLandmassArea(null);
    
    const drawEventModule = {
      init: function (sandbox) {
        sandbox.unregisterFromEventByName(this, 'DrawingEvent');
        sandbox.registerForEventByName(this, 'DrawingEvent');
      },
      getName: function () {
        return 'DrawEventModule';
      },
      onEvent: function (event) {
        if (event.getIsFinished()) {
          sandbox.postRequestByName('DrawTools.StopDrawingRequest', [requestId]);
          sandbox.unregisterFromEventByName(this, 'DrawingEvent');
          const geojson = event.getGeoJson();
          if (geojson.features?.length) {
            doSetSelectedLandmassArea({ geom: geojson.features[0].geometry });
          }
        }
      }
    };

    sandbox.register(drawEventModule);

    Oskari.getSandbox().postRequestByName('DrawTools.StartDrawingRequest', [
      requestId,
      geomType,
      {
        buffer: 200,
        allowMultipleDrawing: 'single',
        drawControl: true,
        modifyControl: true
      }
    ]);
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
              geoJson.features.length > 0 && setSelectedLandmassArea(landmassData => {
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

  
  return (
    <>
    <GlobalStyle actionSelectorState={actionSelectorState} />
    {!!selectedLandmassArea && 
      <StepWizard
        selectedLandmassArea={selectedLandmassArea}
        setSelectedLandmassArea={doSetSelectedLandmassArea}
        handleResetLandmassTool={handleResetLandmassTool}
        handleMapRefresh={handleMapRefresh}
        config={config}
      />
    }
    {!selectedLandmassArea && actionSelectorState === 5 && 
      <ProjectManager
        resetHandler={handleResetLandmassTool}
        config={config}
      /> 
    }
    {!selectedLandmassArea && actionSelectorState !== 5 &&
      <ActionSelector
        actionSelectorState={actionSelectorState}
        setActionSelectorState={setActionSelectorState}
        handleDrawNewPoint={handleDrawNewPoint}
        handleDrawNewArea={handleDrawNewArea}
        handleSelectGeometry={() => setActionSelectorState(3)}
        handleDownloadShapeFile={handleDownloadShapeFile}
        handleManageProjects={() => setActionSelectorState(5)}
        config={config}
      />
    }
    {preSelectedLandmassAreas?.length &&
      <Modal
        zIndex={999999}
        open={preSelectedLandmassAreas?.length}
        onCancel={() => setPreSelectedLandmassAreas(null)}
        onOk={() => {
          const id = preSelectedLandmassAreaId;
          const areas = preSelectedLandmassAreas;
          const area = areas.find(x => x.id === id);
          setPreSelectedLandmassAreas(null);
          doSetSelectedLandmassArea(area);
        }}
      >
        <strong>Valitse yksi kohde</strong>
        <Table
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [preSelectedLandmassAreaId],
            onChange: (selectedRowKeys) => setPreSelectedLandmassAreaId(selectedRowKeys[0])
          }}
          columns={[
            { title: 'Kohteen id', dataIndex: 'key' },
            { title: 'Kunta', dataIndex: 'kunta' },
            { title: 'Kohteen nimi', dataIndex: 'nimi' },
          ]}
          dataSource={preSelectedLandmassAreas.map(({ id, kunta, nimi }) => ({ key: id, kunta, nimi }))}
          pagination={false}
        />
      </Modal>
    }
    </>
  );
};

LandMassTool.propTypes = {
 
};

const contextWrap = LocaleConsumer(LandMassTool);
export { contextWrap as LandMassTool };