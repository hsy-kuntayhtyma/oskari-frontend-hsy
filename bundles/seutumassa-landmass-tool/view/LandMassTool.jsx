import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import '../resources/css/styles.css';
import styled, { createGlobalStyle } from 'styled-components';
import { Controller, LocaleConsumer } from 'oskari-ui/util';

import moment from 'moment';

/* API */
import {
  getSeutumassaToolFields,
  getPersonById,
  addPerson,
  updatePerson,
  getLandmassAreaByCoordinates,
  addLandmassArea,
  updateLandmassArea,
  getLandmassDataByLandmassAreaId,
  addLandmassData,
  updateLandmassData
} from '../resources/api/SeutumassaLandmassToolApi.js';

import { inputFields } from '../resources/inputFields.js'

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
`

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

  const flyoutContent = document.getElementById('landmass-tool-content');

  const [landmassData, setLandmassData] = useState(null);
  const [landmassDataTable, setLandmassDataTable] = useState([]);
  const [inputDefinitions, setInputDefinitions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isMapClickActive, setIsMapClickActive] = useState(false);

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
    //const locale = Oskari.getLocalization('landmass-tool-container');
  
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
                    map.un('click', handleMapClick);
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
    setCurrentStep(0);
    setLandmassData(null);
    setLandmassDataTable([]);
  };

  const handleMapClick = (evt) => {
    const body = { lontitude: evt.coordinate[0], latitude: evt.coordinate[1] };
    setIsLoading(true);
    getLandmassAreaByCoordinates(body).then(response => {
        if(response !== undefined && response.length > 0) {
          map.un('click', handleMapClick);
          setActionSelectorState(0);
          let data = response[0];

          if(data.hasOwnProperty('alku_pvm')){
             data.alku_pvm = data.alku_pvm !== null ? moment(data.alku_pvm) : null;
          }

          if(data.hasOwnProperty('loppu_pvm')){
            data.loppu_pvm = data.loppu_pvm !== null ? moment(data.loppu_pvm) : null;
          }

          if(data.hasOwnProperty('omistaja_id') && data.omistaja_id !== null) {
            getPersonById(data.omistaja_id).then(ownerData => {
              console.log(ownerData);
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
              // response && response.map((landmassData, index) => {
              //   if(landmassData.hasOwnProperty('linkit')){
              //     if(response[index].linkit === null){
              //       response[index].linkit = [];
              //     }
              //   }
              // });
              console.log(response);
              setLandmassDataTable(response);
          })}
        } else {
          setIsLoading(false);
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
            console.log(geoJson);

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
    console.log(sandbox);
    sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [70, true]);
  };
  
  const handleDownloadShapeFile = () => {
    setActionSelectorState(4);
    console.log("handleDownloadShapeFile");
  };

  const handleSaveAndAddNewLandmassData = (data) => {
    const maamassakohde = {
      id: data.id || null,
      nimi: data.nimi || null,
      osoite: data.osoite || null,
      geom: data.geom,
      kohdetyyppi: data.kohdetyyppi || null,
      vaihe: data.vaihe || null,
      omistaja_id: data.omistaja_id || null,
      alku_pvm: data.alku_pvm ? data.alku_pvm.toISOString() : null,
      loppu_pvm: data.loppu_pvm ? data.loppu_pvm.toISOString() : null,
      //lisatieto: data.lisatieto || null,
      kunta: data.kunta || null,
      status: data.status || null,
      //maamassan_tila: data.maamassan_tila || null,
    };

    const henkilo = {
      id: data.henkilo_id || null,
      henkilo_email: data.henkilo_email || null,
      henkilo_nimi: data.henkilo_nimi || null,
      henkilo_organisaatio: data.henkilo_organisaatio || null,
      henkilo_puhelin: data.henkilo_puhelin || null
    };

    const maamassatieto = {
      id: data.maamassatieto_id || null,
      maamassakohde_id: data.maamassakohde_id || null,
      kelpoisuusluokkaryhma: data.kelpoisuusluokkaryhma || null,
      kelpoisuusluokka: data.kelpoisuusluokka || null,
      tiedontuottaja_id: data.tiedontuottaja_id || null,
      planned_begin_date: data.planned_begin_date ? data.planned_begin_date.toISOString() : null,
      planned_end_date: data.planned_end_date ? data.planned_end_date.toISOString() : null,
      realized_begin_date: data.realized_begin_date ? data.realized_begin_date.toISOString() : null,
      realized_end_date: data.realized_end_date ? data.realized_end_date.toISOString() : null,
      amount_total: data.amount_total || null,
      amount_remaining: data.amount_remaining || null,
      lisatieto: data.lisatieto || null,
      liitteet: data.liitteet || null,
      varattu: data.varattu || null,
      //muokattu: moment().toISOString() || null, // Triggers in DB will handle this.
      pilaantuneisuus: data.pilaantuneisuus || null,
      tiedon_luotettavuus: data.tiedon_luotettavuus || null,
      //kunta: data.kunta || null,
      maamassan_tila: data.maamassan_tila || null,
      maamassan_ryhma: data.maamassan_ryhma || null,
      maamassan_laji: data.maamassan_laji || null,
    };

    if(maamassakohde.id !== null) { // Landmass area exists
      console.log("Update landmass area by id");
      updateLandmassArea(maamassakohde);
        if(maamassatieto.id !== null) {
          updateLandmassData(maamassatieto).then(response => {
            console.log(response);
            if(maamassakohde.hasOwnProperty('id')){
              getLandmassDataByLandmassAreaId(maamassakohde.id).then(response => {
                setLandmassDataTable(response);
                setCurrentStep(3);
            })}
          });
        } else {
          maamassatieto.maamassakohde_id = maamassakohde.id;
          addLandmassData(maamassatieto).then(response => {
            console.log(response);
            if(maamassakohde.hasOwnProperty('id')){
              getLandmassDataByLandmassAreaId(maamassakohde.id).then(response => {
                setLandmassDataTable(response);
                setCurrentStep(3);
            })}
          });
        }
    } else {  // Landmass area does not exist
      if(henkilo.id !== null){
        updatePerson(henkilo);
      } else {
        addPerson(henkilo).then(response => {
          console.log(response);
          maamassakohde.omistaja_id = response.henkilo_id;
            addLandmassArea(maamassakohde).then(landmassAreaResponse => {
              console.log(landmassAreaResponse);
              maamassatieto.maamassakohde_id = landmassAreaResponse.id;
              addLandmassData(maamassatieto).then(landmassDataResponse => {
                console.log(landmassDataResponse);
                if(maamassakohde.hasOwnProperty('id')){
                  getLandmassDataByLandmassAreaId(maamassatieto.maamassakohde_id).then(response => {
                    setLandmassDataTable(response);
                    setCurrentStep(3);
                    
                })}
              });
            });
        })
      }
    }
    
    // console.log(maamassakohde);
    // console.log(henkilo);
    console.log(maamassatieto);
  };

  const handleSaveAndClose = (data) => {
    console.log(data);
  };
  
  
  return (
    <>
    <GlobalStyle actionSelectorState={actionSelectorState} />
    { landmassData !== null ?
      <StepWizard
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        inputDefinitions={inputDefinitions}
        landmassData={landmassData}
        setLandmassData={setLandmassData}
        landmassDataTable={landmassDataTable}
        setLandmassDataTable={setLandmassDataTable}
        handleSaveAndAddNewLandmassData={handleSaveAndAddNewLandmassData}
        handleSaveAndClose={handleSaveAndClose}
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