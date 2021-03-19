import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller, LocaleConsumer } from 'oskari-ui/util';

/* COMPONENTS */
import ActionSelector from './components/ActionSelector';
import StepWizard from './components/StepWizard';

const dummyData = {
  // "id": 142,
  // "maamassakohde_id": 9,
  // "kelpoisuusluokkaryhma": "keski",
  // "kelpoisuusluokka": "s4",
  // "tiedontuottaja_id": 2,
  // "planned_begin_date": "2021-03-17T22:00:00.000+00:00",
  // "planned_end_date": "2021-03-30T21:00:00.000+00:00",
  // "amount_remaining": 82048,
  // "lisatieto": "Lisätietoja tänne",
  // "varattu": null,
  // "muokattu": "2021-03-18T08:31:30.917+00:00",
  // "luotu": "2019-05-01T08:42:56.006+00:00",
  // "realized_begin_date": "2021-03-26",
  // "realized_end_date": "2021-03-31",
  // "pilaantuneisuus": "pilaantunut maa, alemman ohjearvon ylittämä",
  // "tiedon_luotettavuus": "A",
  // "amount_total": null,
  // "kunta": null,
  // "external_id": null,
  // "alkupera_id": null,
  // "maamassan_ryhma": "moreenimaalajit",
  // "maamassan_tila": "alijaama/tarvittava",
  // "attachments": null,
  // "maamassan_laji": "siltti"
};

// const login = "testuser";
// const password = "password";
// const authString = `${username}:${password}`;

const LandMassTool = () => {

  const [landMassData, setLandMassData] = useState(null);
  const [inputDefinitions, setInputDefinitions] = useState([]);

  console.log(landMassData);

  useEffect(() => {
    jQuery.ajax({
      type: 'GET',
      dataType: 'json',
      data: { all: true },
      url: Oskari.urls.getRoute('GetSeutumassaToolFields'),
      success: function (pResp) {
        //console.log(pResp);
        setInputDefinitions(pResp);
          //handler(null, pResp);
      },
      error: function (jqXHR, textStatus) {
          handler('Error', []);
      }
    });
  },[]);



  // useEffect(() => {
  //   const url = 'http://localhost:8090/api/v1/landmassarea/136';

  //   let headers = new Headers();
  //   headers.set('Authorization', 'Basic ' + btoa(authString))
  //   fetch(url,{method: 'GET', headers: headers})
  //       .then(function (response) {
  //           console.log (response)
  //           return response
  //       });

  // });

  const handleSelectGeometry = (id) => {
        setLandMassData(dummyData);
  };

  const handleDrawNewGeometry = () => {
    console.log("handleDrawNewGeometry");
  };

  const handleDownloadShapeFile = () => {
    console.log("handleDownloadShapeFile");
  };

  return (
    <>
    {/* <StepWizard enumDefinitions={enumDefinitions.definitions} landMassData={landMassData} setLandMassData={setLandMassData}/> */}
    { landMassData !== null ? <StepWizard inputDefinitions={inputDefinitions} landMassData={landMassData} setLandMassData={setLandMassData} /> :
      <ActionSelector
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