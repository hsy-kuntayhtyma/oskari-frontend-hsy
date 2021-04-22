import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller, LocaleConsumer } from 'oskari-ui/util';

/* API */
import { getSeutumassaToolFields, getLandmassAreaByCoordinates, getPersonById, getLandmassDataByLandmassAreaId } from '../resources/api/SeutumassaLandmassToolApi.js';

import { inputFields } from '../resources/inputFields.js'

/* COMPONENTS */
import ActionSelector from './components/ActionSelector';
import StepWizard from './components/StepWizard';

const LandMassTool = () => {

  const sandbox = Oskari.getSandbox();
  const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
  const map = mapModule.getMap();

  const flyoutContainer = document.getElementById('landmass-tool-container');
  flyoutContainer.style.setProperty("transition", "opacity 0.3s ease-out", "important");
  flyoutContainer.style.setProperty("max-width", "calc(100% - 200px)", "important");
  flyoutContainer.style.setProperty("border-radius", "10px", "important");
  flyoutContainer.style.setProperty("overflow", "hidden", "important");

  const flyoutContent = document.getElementById('landmass-tool-content');

  const [landmassData, setLandmassData] = useState(null);
  const [landmassDataTable, setLandmassDataTable] = useState([]);
  const [inputDefinitions, setInputDefinitions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isMapClickActive, setIsMapClickActive] = useState(false);

  const [actionSelectorState, setActionSelectorState] = useState(0);
  
  const handleEnableMapClick = () => {
    map.on('click', handleMapClick);
    //setIsMapClickActive(false);
  };

  const handleDisableMapClick = () => {
    map.un('click', handleMapClick);
    //setIsMapClickActive(true);
  };

  useEffect(() => {
    //console.log(actionSelectorState);
    switch(actionSelectorState) {
      case 0:

      break;
      case 1:

      break;
      case 2:
        //flyoutContainer.style.setProperty("opacity", "0.5", "important");
      break;
      case 3:

      break;
    }
  }, [actionSelectorState]);

  useEffect(() => {
    //console.log(inputFields);

    setInputDefinitions(inputFields);

    // getSeutumassaToolFields().then(response => {
    //   console.log(response);
    //   setInputDefinitions(response);
    // });

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
                    flyoutContainer.style.setProperty("opacity", "0", "important");
                    handleResetLandmassTool();
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

  const handleResetLandmassTool = () => {
    setActionSelectorState(0);
    setLandmassData(null);
    setLandmassDataTable([]);
  };

  const handleMapClick = (evt) => {

    const body = { lontitude: evt.coordinate[0], latitude: evt.coordinate[1] };
    setIsLoading(true);
    flyoutContainer.style.setProperty("opacity", "1", "important");
    getLandmassAreaByCoordinates(body).then(response => {
        console.log(response);

        if(response !== undefined && response.length > 0) {
          let data = response[0];
          handleDisableMapClick();
          setActionSelectorState(0);
          //setLandmassData(data);
          if(data.hasOwnProperty('omistaja_id') && data.omistaja_id !== null) {
            getPersonById(data.omistaja_id).then(ownerData => {
              var newData = {...data, ...ownerData};
              console.log(newData);
              setLandmassData(newData);
              setIsLoading(false);

            });
          } else {
            setLandmassData(data);
            setIsLoading(false);

          }

          if(data.hasOwnProperty('id')){
            getLandmassDataByLandmassAreaId(data.id).then(response => {
            console.log(response);
            setLandmassDataTable(response);
          })}
        } else {
          setIsLoading(false);
        }

    });
  };

  const handleDrawNewGeometry = () => {
    setActionSelectorState(1);
    handleDisableMapClick();
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
            console.log(event.getGeoJson());
              event.getGeoJson().features.length > 0 && setLandmassData(landmassData => {
                return { ...landmassData, geom: event.getGeoJson() }
              });
          }
      }
    };

    sandbox.register(drawEventModule);

    Oskari.getSandbox().postRequestByName('DrawTools.StartDrawingRequest', [
            'newGeometry',
            'Polygon',
            {
                buffer: 200,
                allowMultipleDrawing: 'single',
                drawControl: true,
                modifyControl: true
            }]
    );
  };

  const handleSelectGeometry = () => {

    if(actionSelectorState !== 2){
      console.log("actionSelectorState !== 2");
      setActionSelectorState(2);
    } else {
      console.log("actionSelectorState === 2");
      setActionSelectorState(0);
    }
    sandbox.postRequestByName('DrawTools.StopDrawingRequest', ['newGeometry', true]);
    handleEnableMapClick();
  };
  
  const handleDownloadShapeFile = () => {
    setActionSelectorState(3);
    console.log("handleDownloadShapeFile");
  };
  
  return (
    <>
    { landmassData !== null ?
      <StepWizard 
        inputDefinitions={inputDefinitions}
        landmassData={landmassData}
        setLandmassData={setLandmassData}
        landmassDataTable={landmassDataTable}
        setLandmassDataTable={setLandmassDataTable}
        handleResetLandmassTool={handleResetLandmassTool}
      /> :
      <ActionSelector
          isLoading={isLoading}
          actionSelectorState={actionSelectorState}
          handleSelectGeometry={handleSelectGeometry}
          handleDrawNewGeometry={handleDrawNewGeometry}
          handleDownloadShapeFile={handleDownloadShapeFile}
      />
    }

    </>
  );
};

LandMassTool.propTypes = {
 
};

const contextWrap = LocaleConsumer(LandMassTool);
export { contextWrap as LandMassTool };