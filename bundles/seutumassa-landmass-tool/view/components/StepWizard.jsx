import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal, Alert, Result, Form, Table, Popover, DatePicker, Tag, Space, Spin, Select, Switch, Steps, Button, Input, InputNumber, message, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined, LoadingOutlined, LeftOutlined, RightOutlined, SaveOutlined, DeleteOutlined} from '@ant-design/icons';
import { Controller, LocaleConsumer } from 'oskari-ui/util';

import moment from 'moment';

//import 'moment/locale/fi.js';
//import '../../../../node_modules/moment/locale/fi.js';
import locale from 'antd/es/date-picker/locale/fi_FI';

import '../../resources/css/styles.css';
import 'antd/dist/antd.css';

/* API */
import {
  getPersonById,
  addPerson,
  updatePerson,
  getLandmassAreaByCoordinates,
  addLandmassArea,
  updateLandmassArea,
  getLandmassDataByLandmassAreaId,
  addLandmassData,
  updateLandmassData,
  deleteLandmassAreaById,
  deleteLandmassDataById
} from '../../resources/api/SeutumassaLandmassToolApi.js';

import { List } from "rc-field-form";

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const StyledStepsContent = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #fafafa;
  border: 1px dashed #e9e9e9;
  border-radius: 2px;
`;

const StyledStepsAction = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

const StyledStepNavigators = styled.div`
  display: flex;
  align-items: center;
`;

const StyledStepTitle = styled.div`
  font-size: 15px;
`;

const StyledDoneContainer = styled.div`

`;

const StyledSelectorGroup = styled.div`
  
`;

const StyledFormItemContainer = styled.div`
  display: flex;
  //align-items: center;
  margin-bottom: 10px;

  /* .ant-form-item-label {
    display: flex;
    align-items: center;
    font-size: 15px;
  } */
`;

const StyledFormListContainer = styled.div`
  width: 100%;
`;

const StyledFormList = styled(Form.List)`

`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 0 !important;
  width: 100%;
  .ant-picker {
    width: 100%;
  }
`;


const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledTable = styled(Table)`
  cursor: pointer;

  table {
    margin: 0;
  }

  td {
    vertical-align: middle;
  }

  /* tbody {
    tr {
      //height: 30px;
      transition: all 0.3s ease-out;
      &:hover {
        background-color: #e9e9e9;
      }
    }
  } */

  /* th {
   text-align: left;
  }

  td {
    padding: 0;
    vertical-align: middle;
  }

  .ant-pagination {
    text-align: center;
  } */
`;

const StyledTableAddDataButton = styled(Button)`
  margin-top: 20px;
  border-radius: 5px !important;
`;

const StyledSelector = styled(Select)`
  width: 100%;
`;

const StyledStepNavigatorButton = styled(Button)`
  margin-right: 10px;
  min-width: 85px;
`;

const StyledDescriptionTitle = styled.p`
    //padding: 5px;
    margin: 0;
    font-size: 16px;
    font-family: "Open Sans", Arial, sans-serif !important;
    //text-align: center;
`;

const StyledDescriptionContent = styled.div`
    font-size: 15px;
    font-family: "Open Sans", Arial, sans-serif !important;
`;

const StyledLoaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledSuccessSubtitleContainer = styled.div`
  padding: 20px;
`;

const StyledBottomText = styled.div`
  color: #1890ff;
  text-align: center;
  font-weight: bold;
`;

const StepWizard = ({
    isLoading,
    setIsLoading,
    currentStep,
    setCurrentStep,
    inputDefinitions,
    landmassData,
    setLandmassData,
    landmassDataTable,
    setLandmassDataTable,
    handleResetLandmassTool,
    modalContent,
    setModalContent,
    handleMapRefresh
}) => {

const [form] = Form.useForm();
const [successMessage, setSuccessMessage] = useState(null);

const handleModalSubmitActions = () => {
  //setIsModalLoading(true);
  console.log(modalContent);
  setModalContent({...modalContent, loading: true});
  
  switch(modalContent.action){
    case "deleteLandmassAreaById":
      console.log("deleteLandmassAreaById");
      console.log(modalContent.id);
      deleteLandmassAreaById(modalContent.id).then(response => {
        handleMapRefresh();
        setTimeout(() => {
          setModalContent({...modalContent, loading: false});
        }, 1500);
        setTimeout(() => {
          setModalContent(null);
          handleResetLandmassTool();
        }, 2500);
      });
    break
    case "deleteLandmassDataById":
      console.log("deleteLandmassDataById");
        deleteLandmassDataById(modalContent.id).then(response => {
          setLandmassDataTable(landmassDataTable.filter(data => data.maamassatieto_id !== response));
          setTimeout(() => {
            setModalContent({...modalContent, loading: false});
          }, 1500);
          setTimeout(() => {
            setModalContent(null);
          }, 2500);
        });
    break;
    default:

    break;
  }

}


const handleNewLandmassData = () => {
    form.setFieldsValue({
      maamassatieto_id: null,
      maamassakohde_id:  null,
      kelpoisuusluokkaryhma: null,
      kelpoisuusluokka:  null,
      tiedontuottaja: null,
      planned_begin_date:  null,
      planned_end_date: null,
      realized_begin_date: null,
      realized_end_date: null,
      amount_total:  null,
      amount_remaining: null,
      lisatieto: null,
      liitteet: null,
      varattu: null,
      pilaantuneisuus: null,
      tiedon_luotettavuus: null,
      maamassan_tila: null,
      maamassan_ryhma: null,
      maamassan_laji: null
    });
    handleNext({});
};

const handleSelectLandmassData = (data) => {
  if(data.hasOwnProperty('planned_begin_date')){
    data.planned_begin_date = data.planned_begin_date !== null ? moment(data.planned_begin_date) : null;
  }
  if(data.hasOwnProperty('planned_end_date')){
    data.planned_end_date = data.planned_end_date !== null ? moment(data.planned_end_date) : null;
  }
  if(data.hasOwnProperty('realized_begin_date')){
    data.realized_begin_date = data.realized_begin_date !== null ? moment(data.realized_begin_date) : null;
  }
  if(data.hasOwnProperty('realized_end_date')){
    data.realized_end_date = data.realized_end_date !== null ? moment(data.realized_end_date) : null;
  }
  handleNext(data);
}

const handleNext = (values) => {
  if(currentStep < steps.length - 2) {
    setCurrentStep(currentStep + 1);
    form.setFieldsValue(values);
  } else { // All steps are done and required field filled. -> Save data to database.
    console.log("Save data here");
    setCurrentStep(currentStep + 1);
    handleSaveAndAddNewLandmassData(form.getFieldsValue(true));
  }
};

const onNextFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const handlePrevious = () => {
  currentStep > 0 ? setCurrentStep(currentStep - 1) : handleResetLandmassTool();
};

const handleSuccessMessage = (maamassakohde, maamassatieto) => {
  handleMapRefresh();
  setSuccessMessage({
    title: "Tallennus onnistui",
    subtitle: <StyledSuccessSubtitleContainer>
      <div>
        <h4>Kohde</h4>
        {/* <p>Id: {maamassakohde.id || "-"}</p> */}
        <p>Nimi: {maamassakohde.nimi || "-"}</p>
        <p>Osoite: {maamassakohde.osoite || "-"}</p>
        <p>Kohdetyyppi: {maamassakohde.kohdetyyppi || "-"}</p>
        <p>Vaihe: {maamassakohde.vaihe || "-"}</p>
        <p>Aloitus kk: {maamassakohde.alku_pvm !== null ? moment(maamassakohde.alku_pvm).format("MM-YYYY") : "-"}</p>
        <p>Lopetus kk: {maamassakohde.loppu_pvm !== null ? moment(maamassakohde.loppu_pvm).format("MM-YYYY") : "-"}</p>
        <p>Kunta: {maamassakohde.kunta === "049" && "Espoo" || maamassakohde.kunta === "091" && "Helsinki" || maamassakohde.kunta === "092" && "Vantaa" || "-"}</p>
        <p>Status: {maamassakohde.status || "-"}</p>
      </div>
      <div>
        <h4>Maamassan tiedot</h4>
        {/* <p>Id: {maamassatieto.maamassatieto_id || "-"}</p> */}
        <p>Kelpoisuusluokkaryhmä: {maamassatieto.kelpoisuusluokkaryhma || "-"}</p>
        <p>Kelpoisuusluokka: {maamassatieto.kelpoisuusluokka || "-"}</p>
        <p>Suunniteltu aloitus kk: {maamassatieto.planned_begin_date !== null ? moment(maamassatieto.planned_begin_date).format("MM-YYYY") : "-"}</p>
        <p>Suunniteltu lopetus kk: {maamassatieto.planned_end_date !== null ? moment(maamassatieto.planned_end_date).format("MM-YYYY") : "-"}</p>
        <p>Toteutunut aloitus kk: {maamassatieto.realized_begin_date !== null ? moment(maamassatieto.realized_begin_date).format("MM-YYYY") : "-"}</p>
        <p>Toteutunut lopetus kk: {maamassatieto.realized_end_date !== null  ? moment(maamassatieto.realized_end_date).format("MM-YYYY") : "-"}</p>
        <p>Massaa jäljellä: {maamassatieto.amount_remaining || "-"}</p>
        <p>Status: {maamassatieto.status || "-"}</p>
        <p>Lisätiedot: {maamassatieto.lisatieto || "-"}</p>
        <p>Linkki: {maamassatieto.liitteet || "-"}</p>
        <p>Varattu: {maamassatieto.varattu ? "Kyllä" : "Ei" || "-"}</p>
        <p>Pilaantuneisuus: {maamassatieto.pilaantuneisuus || "-"}</p>
        <p>Tiedon luotettavuus: {maamassatieto.tiedon_luotettavuus || "-"}</p>
        <p>Massan tila: {maamassatieto.maamassan_tila || "-"}</p>
        <p>Massan ryhmä: {maamassatieto.maamassan_ryhma || "-"}</p>
        <p>Massan laji: {maamassatieto.maamassan_laji || "-"}</p>
      </div>
    </StyledSuccessSubtitleContainer>
  });
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
    tiedontuottaja: data.tiedontuottaja || null,
    planned_begin_date: data.planned_begin_date ? data.planned_begin_date.toISOString() : null,
    planned_end_date: data.planned_end_date ? data.planned_end_date.toISOString() : null,
    realized_begin_date: data.realized_begin_date ? data.realized_begin_date.toISOString() : null,
    realized_end_date: data.realized_end_date ? data.realized_end_date.toISOString() : null,
    amount_remaining: data.amount_remaining || null,
    lisatieto: data.lisatieto || null,
    liitteet: data.liitteet || null,
    varattu: data.varattu || false,
    //muokattu: moment().toISOString() || null, // Triggers in DB will handle this.
    pilaantuneisuus: data.pilaantuneisuus || null,
    tiedon_luotettavuus: data.tiedon_luotettavuus || null,
    //kunta: data.kunta || null,
    maamassan_tila: data.maamassan_tila || null,
    maamassan_ryhma: data.maamassan_ryhma || null,
    maamassan_laji: data.maamassan_laji || null,
  };

  if(maamassakohde.id !== null) { // Landmass area exists
    setIsLoading(true);
    addPerson(henkilo).then(response => {
      maamassakohde.omistaja_id = response.henkilo_id;
      updateLandmassArea(maamassakohde).then(() => {
        if(maamassatieto.id !== null) {
          updateLandmassData(maamassatieto).then(landmassDataResponse => {
            if(maamassakohde.hasOwnProperty('id')){
              getLandmassDataByLandmassAreaId(maamassakohde.id).then(landmassDataResponse => {
                setIsLoading(false);
                setLandmassDataTable(landmassDataResponse);
                handleSuccessMessage(maamassakohde, maamassatieto);
                //setCurrentStep(3);
              })
            } else {
              setIsLoading(false);
              handleSuccessMessage(maamassakohde, maamassatieto);
            }
          });
        } else {
          maamassatieto.maamassakohde_id = maamassakohde.id;
          maamassatieto.amount_total = data.amount_remaining;
          setIsLoading(true);
          addLandmassData(maamassatieto).then(landmassDataResponse => {
            if(maamassakohde.hasOwnProperty('id')){
              getLandmassDataByLandmassAreaId(maamassakohde.id).then(landmassDataResponse => {
                setIsLoading(false); 
                setLandmassDataTable(landmassDataResponse);
                //setCurrentStep(3);
                handleSuccessMessage(maamassakohde, maamassatieto);
              }
            )} else {
              setIsLoading(false);
              handleSuccessMessage(maamassakohde, maamassatieto);
            }
          });
        }
      });
    });
  } else {  // Landmass area does not exist
    setIsLoading(true);
    if(henkilo.id !== null){
        updatePerson(henkilo).then(response => {
          setIsLoading(false);
          handleSuccessMessage(maamassakohde, maamassatieto);
        });
    } else {
      addPerson(henkilo).then(response => {
        maamassakohde.omistaja_id = response.henkilo_id;
          addLandmassArea(maamassakohde).then(landmassAreaResponse => {
              
            if(landmassAreaResponse.hasOwnProperty('alku_pvm')){
              landmassAreaResponse.alku_pvm = landmassAreaResponse.alku_pvm !== null ? moment(landmassAreaResponse.alku_pvm) : null;
            }

            if(landmassAreaResponse.hasOwnProperty('loppu_pvm')){
            landmassAreaResponse.loppu_pvm = landmassAreaResponse.loppu_pvm !== null ? moment(landmassAreaResponse.loppu_pvm) : null;
            }

            form.setFieldsValue(landmassAreaResponse);
            maamassatieto.maamassakohde_id = landmassAreaResponse.id;
            maamassatieto.amount_total = data.amount_remaining;
            addLandmassData(maamassatieto).then(landmassDataResponse => {
              console.log(landmassDataResponse);
              if(maamassakohde.hasOwnProperty('id')){
                getLandmassDataByLandmassAreaId(maamassatieto.maamassakohde_id).then(response => {
                  setIsLoading(false);
                  setLandmassDataTable(response);
                  handleSuccessMessage(maamassakohde, maamassatieto);
                  //setCurrentStep(3);
                  
              })} else {
                setIsLoading(false);
                handleSuccessMessage(maamassakohde, maamassatieto);
              }
            });
          });
      })
    }
  }
};

const SelectorFormItem = ({id, name, description, placeholder, rules, enumDefinitions, value}) => {
 const userRoles = Oskari.user().getRoles();
  
  //   const userRoles = [
  //     {
  //         "name": "Guest",
  //         "id": 1
  //     },
  //     {
  //       "name": "User",
  //       "id": 2
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
  //     },
  //     {
  //       "name": "SeutuMassa_HSY",
  //       "id": 22
  //     }
  // ];

  return <StyledFormItemContainer>
  <StyledFormItem
    name={id}
    label={name}
    rules={rules}
  >
    <StyledSelector
      placeholder={placeholder}
      allowClear
    >
      {

      enumDefinitions.map((enumDefinition, index) => {
        if(id === 'kunta'){
          return  <Option
          key={enumDefinition.title+'_' + index}
          value={enumDefinition.id}
          disabled={
            userRoles.some(role => role.id === 3) || userRoles.some(role => role.id === 4) || userRoles.some(role => role.id === 22) ?
            false : userRoles.some(role => role.id === 19) && enumDefinition.id === "049" ?
            false : userRoles.some(role => role.id === 20) && enumDefinition.id === "091" ?
            false : userRoles.some(role => role.id === 21) && enumDefinition.id === "092" ?
            false : true
          }
        >
          {enumDefinition.title}
        </Option>
        } else {
          return <Option
          key={enumDefinition.title+'_' + index}
          value={enumDefinition.id}
        >
          {enumDefinition.title}
        </Option>
        }
      }
      )}
    </StyledSelector>
  </StyledFormItem>
  {
      description !== null &&
      <Popover
        placement="topRight"
        content={
            <StyledDescriptionContent>
              {description !== null && description}
            </StyledDescriptionContent>
        }
        title={<StyledDescriptionTitle>{name}</StyledDescriptionTitle>}>
            <Button type="primary">?</Button>
      </Popover> 
    }
  </StyledFormItemContainer>
};

const TableFormItem = ({columns, data, handleNext, description}) => (
    <StyledTableContainer>
      {description !== null && <p>{description}</p>}

      <StyledTable
        scroll={{ x: 1500, y: 260 }}
        columns={columns}
        dataSource={data}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              handleSelectLandmassData(record);
            } // click row
            //onDoubleClick: event => {}, // double click row
            //onContextMenu: event => {}, // right button click row
            //onMouseEnter: event => {}, // mouse enter row
            //onMouseLeave: event => {}, // mouse leave row
          };
        }}
      >

      </StyledTable>
    <StyledTableAddDataButton onClick={() => handleNewLandmassData()}>LISÄÄ UUSI TIETO</StyledTableAddDataButton>
    </StyledTableContainer>
);

const SwitchFormItem = ({id, name, description, rules}) => (
  <StyledFormItemContainer>
    <StyledFormItem
      name={id}
      label={name}
      rules={rules}
      valuePropName="checked"
    >
      <Switch />
    </StyledFormItem>
    {
      description !== null &&
      <Popover
        style={{zIndex: '999999'}}
        placement="topRight"
        content={
            <StyledDescriptionContent>
              {description !== null && description}
            </StyledDescriptionContent>
        }
        title={<StyledDescriptionTitle>{name}</StyledDescriptionTitle>}>
            <Button type="primary">?</Button>
      </Popover> 
    }
  </StyledFormItemContainer>
);

const NumberFormItem = ({id, name, description, rules}) => (
  <StyledFormItemContainer>
    <StyledFormItem
      name={id}
      label={name}
      rules={rules}
    >
      <InputNumber />
    </StyledFormItem>
    {
      description !== null &&
      <Popover
        style={{zIndex: '999999'}}
        placement="topRight"
        content={
            <StyledDescriptionContent>
              {description !== null && description}
            </StyledDescriptionContent>
        }
        title={<StyledDescriptionTitle>{name}</StyledDescriptionTitle>}>
            <Button type="primary">?</Button>
      </Popover>
    }
  </StyledFormItemContainer>
);

const DateFormItem = ({id, name, description, rules, type}) => (
  <StyledFormItemContainer>
    <StyledFormItem
      name={id}
      label={name}
      rules={rules}
    >
      <DatePicker
        popupStyle={{zIndex: '999999'}}
        picker={type}
        placeholder="Valitse kuukausi"
        locale={locale}
       //defaultValue={moment("2021-08", 'YYYY-MM')}
      />
    </StyledFormItem>
    {
      description !== null &&
      <Popover
        placement="topRight"
        content={
            <StyledDescriptionContent>
              {description !== null && description}
            </StyledDescriptionContent>
        }
        title={<StyledDescriptionTitle>{name}</StyledDescriptionTitle>}>
            <Button type="primary">?</Button>
      </Popover> 
    }
  </StyledFormItemContainer>
);

const TextInputFormItem = ({id, name, description, placeholder, rules}) => (
  <StyledFormItemContainer>
    <StyledFormItem
      name={id}
      label={name}
      rules={rules}
    >
      <Input placeholder={placeholder}/>
    </StyledFormItem>
    {
      description !== null &&
      <Popover
        placement="topRight"
        content={
            <StyledDescriptionContent>
              {description !== null && description}
            </StyledDescriptionContent>
        }
        title={<StyledDescriptionTitle>{name}</StyledDescriptionTitle>}>
            <Button type="primary">?</Button>
      </Popover> 
    }
  </StyledFormItemContainer>
);

const TextAreaFormItem = ({id, name, description, placeholder, rules}) => (
  <StyledFormItemContainer>
    <StyledFormItem
      name={id}
      label={name}
      rules={rules}
    >
      <TextArea style={{resize: 'vertical'}} placeholder={placeholder}/>
    </StyledFormItem>
    {
      description !== null &&
      <Popover
        placement="topRight"
        content={
            <StyledDescriptionContent>
              {description !== null && description}
            </StyledDescriptionContent>
        }
        title={<StyledDescriptionTitle>{name}</StyledDescriptionTitle>}>
            <Button type="primary">?</Button>
      </Popover> 
    }
  </StyledFormItemContainer>
);

const ListFormItem = ({id, name, description, placeholder, rules}) => (
  <StyledFormItemContainer>
    <StyledFormListContainer>
      <StyledFormList
        name="linkit"
      >
        {
        (fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              // <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
              <div>
                <StyledFormItem
                  {...restField}
                  name={[name, 'linkki']}
                  fieldKey={[fieldKey, 'linkki']}
                  //rules={[{ required: true, message: 'Missing first name' }]}
                >
                  <Input placeholder={placeholder} />
                </StyledFormItem>
                <MinusCircleOutlined onClick={() => remove(name)} />
                </div>
              // </Space>
            ))}
            <StyledFormItem>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Lisää linkki
              </Button>
            </StyledFormItem>
          </>
        )
        }
      </StyledFormList>
    </StyledFormListContainer>
    {
      description !== null &&
      <Popover
        placement="topRight"
        content={
            <StyledDescriptionContent>
              {description !== null && description}
            </StyledDescriptionContent>
        }
        title={<StyledDescriptionTitle>{name}</StyledDescriptionTitle>}>
            <Button type="primary">?</Button>
      </Popover> 
    }
  </StyledFormItemContainer>
);

const steps = [
    {
      title: 'Kohteen tiedot',
      //description: '',
      status: ''
    },
    {
      title: 'Yhteystiedot',
      //description: '',
      status: ''
    },
    {
      title: 'Aikataulu',
     //description: '',
      status: ''
    },
    {
      title: 'Alueen tiedot',
      //description: '',
      status: ''
    },
    {
      title: 'Massan tiedot',
      //description: '',
      status: ''
    },
    {
      title: 'Kelpoisuus',
      //description: '',
      status: ''
    },
    {
      title: 'Lisätiedot',
      //description: '',
      status: ''
    },
    {
      title: 'Tallennus',
      //description: '',
      status: ''
    }
  ];

  return (
    <>
      <Steps current={currentStep} progressDot>
        {steps.map((step, index) =>
          <Step
            key={step.title}
            title={<StyledStepTitle>{step.title}</StyledStepTitle>}
            // icon={steps.length-1 === index && isLoading && <LoadingOutlined />}
            description={step.description}
            />
        )}
      </Steps>
      {/* <Divider /> */}
      <Form
        {...layout}
        form={form}
        initialValues={landmassData}
        onFinish={handleNext}
        onFinishFailed={onNextFailed}
      >
      <StyledStepsContent>
      {
      isLoading || successMessage ?
        <StyledLoaderContainer>
            {isLoading && <Spin size="large" />}
            {successMessage && <Result
            style={{width: "100%"}}
                status="success"
                title={successMessage.title}
                subTitle={successMessage.subtitle}
                extra={[
                  <Button
                    type="primary"
                    key="console"
                    onClick={() => {
                      setSuccessMessage(null);
                      form.setFieldsValue({
                        maamassatieto_id: null,
                        maamassakohde_id:  null,
                        kelpoisuusluokkaryhma: null,
                        kelpoisuusluokka:  null,
                        tiedontuottaja: null,
                        planned_begin_date:  null,
                        planned_end_date: null,
                        realized_begin_date: null,
                        realized_end_date: null,
                        amount_total:  null,
                        amount_remaining: null,
                        lisatieto: null,
                        liitteet: null,
                        varattu: null,
                        pilaantuneisuus: null,
                        tiedon_luotettavuus: null,
                        maamassan_tila: null,
                        maamassan_ryhma: null,
                        maamassan_laji: null,
                      });
                      setCurrentStep(4);
                    }}
                >
                Lisää uusi tieto
              </Button>,
              <Button
                key="buy"
                onClick={() => {
                  
                  handleResetLandmassTool();
                }}
                >
                  Sulje
              </Button>,
            ]}
          />
          }
        </StyledLoaderContainer> :
        <StyledSelectorGroup>
          {inputDefinitions[currentStep] !== undefined && inputDefinitions[currentStep].map(inputDefinitionGroup => {
              if(inputDefinitionGroup.type === 'select'){
                return <SelectorFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={inputDefinitionGroup.title}
                  description={inputDefinitionGroup.description ? inputDefinitionGroup.description : null}
                  placeholder={inputDefinitionGroup.placeHolderText}
                  rules={inputDefinitionGroup.rules ? inputDefinitionGroup.rules : []}
                  enumDefinitions={inputDefinitionGroup.values}
                />
              } else if (inputDefinitionGroup.type === 'table'){
                const columns = [
                  {
                    key: 'th_poista_rivi',
                    title: '',
                    dataIndex: '',
                    width: 60,
                    render: record => {
                      return (
                      <div
                          onClick={event => {
                          event.stopPropagation();
                        }}>
                          {
                            <>
                          <a onClick={() => {
                            setModalContent({
                              id: record.maamassatieto_id,
                              action: "deleteLandmassDataById",
                              title: "Poista maamassatieto",
                              message: "Varoitus",
                              description: "Haluatko varmasti poistaa maamassatiedon?",
                              loading: false
                            });
                          }}
                          >Poista</a>
                          </>
                          }
                        </div>
                      )
                    }
                  },
                  {
                    key: 'th_maamassatieto_id',
                    title: 'Id',
                    dataIndex: 'maamassatieto_id',
                    //align: 'left',
                    width: 60,
                    //fixed: 'left'
                  },
                  {
                    key: "th_maamassan_tila",
                    title: 'Maamassatila',
                    dataIndex: 'maamassan_tila',
                    //align: 'left',
                    width: 150,
                    //fixed: 'left'
                  },
                  {
                    key: "th_maamassan_ryhma",
                    title: 'Maamassaryhmä',
                    dataIndex: 'maamassan_ryhma',
                    //align: 'left',
                    width: 200,
                   //fixed: 'left'
                  },
                  {
                    key: "th_maamassan_laji",
                    title: 'Maamassalaji',
                    dataIndex: 'maamassan_laji',
                    //align: 'left',
                    width: 100,
                    //fixed: 'left'
                  },
                  {
                    key: "th_amount_total",
                    title: 'Massaa yhteensä',
                    dataIndex: 'amount_total',
                    //align: 'left',
                    width: 100,
                    //fixed: 'left'
                  },
                  {
                    key: "th_amount_remaining",
                    title: 'Massaa jäljellä',
                    dataIndex: 'amount_remaining',
                    //align: 'left',
                    width: 100,
                  },
                  {
                    key: "th_kelpoisuusluokkaryhma",
                    title: 'Kelpoisuusluokkaryhmä',
                    dataIndex: 'kelpoisuusluokkaryhma',
                    //align: 'left',
                    width: 130,
                    //fixed: 'left'
                  },
                  {
                    key: "th_kelpoisuusluokka",
                    title: 'Kelpoisuusluokka',
                    dataIndex: 'kelpoisuusluokka',
                    //align: 'left',
                    width: 100,
                    //fixed: 'left'
                  },
                  {
                    key: 'th_varattu',
                    title: 'Varattu',
                    dataIndex: 'varattu',
                    //align: 'left',
                    width: 60,
                    //fixed: 'left'
                  },
                  {
                    key: "th_luotu",
                    title: 'Luotu',
                    dataIndex: 'luotu',
                    width: 150,
                    //align: 'left',
                  },
                  {
                    key: "th_muokattu",
                    title: 'Muokattu',
                    dataIndex: 'muokattu',
                    width: 150,
                    //align: 'left',
                  },
                ];
                
                return <TableFormItem
                  key={inputDefinitionGroup.id}
                  columns={columns}
                  data={landmassDataTable}
                  handleNext={handleNext}
                  setLandmassData={setLandmassData}
                  description={inputDefinitionGroup.description ? inputDefinitionGroup.description : null}
                />
              } else if (inputDefinitionGroup.type === 'number'){
                return <NumberFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={inputDefinitionGroup.title}
                  description={inputDefinitionGroup.description ? inputDefinitionGroup.description : null}
                  rules={inputDefinitionGroup.rules ? inputDefinitionGroup.rules : []}
                />
              } else if (inputDefinitionGroup.type === 'boolean'){
                return <SwitchFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={inputDefinitionGroup.title}
                  description={inputDefinitionGroup.description ? inputDefinitionGroup.description : null}
                  rules={inputDefinitionGroup.rules ? inputDefinitionGroup.rules : []}
                />
              } else if (inputDefinitionGroup.type === 'month'){
                return <DateFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={inputDefinitionGroup.title}
                  description={inputDefinitionGroup.description ? inputDefinitionGroup.description : null}
                  rules={inputDefinitionGroup.rules ? inputDefinitionGroup.rules : []}
                  type={inputDefinitionGroup.type}
                />
              } else if (inputDefinitionGroup.type === 'textfield'){
                return <TextInputFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={inputDefinitionGroup.title}
                  description={inputDefinitionGroup.description ? inputDefinitionGroup.description : null}
                  placeholder={inputDefinitionGroup.title}
                  rules={inputDefinitionGroup.rules ? inputDefinitionGroup.rules : []}
                />
              } else if (inputDefinitionGroup.type === 'email'){
                return <TextInputFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={inputDefinitionGroup.title}
                  description={inputDefinitionGroup.description ? inputDefinitionGroup.description : null}
                  placeholder={inputDefinitionGroup.title}
                  rules={inputDefinitionGroup.rules ? inputDefinitionGroup.rules : []}
                />
              } else if (inputDefinitionGroup.type === 'textarea'){
                return <TextAreaFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={inputDefinitionGroup.title}
                  description={inputDefinitionGroup.description ? inputDefinitionGroup.description : null}
                  placeholder={inputDefinitionGroup.title}
                  rules={inputDefinitionGroup.rules ? inputDefinitionGroup.rules : []}
                />
              } 
              // else if (inputDefinitionGroup.type === 'list'){
              //   return <ListFormItem
              //     key={inputDefinitionGroup.id}
              //     id={inputDefinitionGroup.id}
              //     name={inputDefinitionGroup.title}
              //     description={inputDefinitionGroup.description ? inputDefinitionGroup.description : null}
              //     placeholder={inputDefinitionGroup.placeHolderText}
              //     rules={inputDefinitionGroup.rules ? inputDefinitionGroup.rules : []}
              //   />
              // }
          })}
         </StyledSelectorGroup>
      }
        </StyledStepsContent>
 
      <StyledStepsAction>
        <StyledStepNavigators>
          <Form.Item>
            <StyledStepNavigatorButton
              disabled={currentStep === steps.length - 1}
              onClick={() => {
                  handlePrevious();
              }}
              //icon={<LeftOutlined />}
            >
                  Edellinen
            </StyledStepNavigatorButton>
          </Form.Item>
          <Form.Item>
            <StyledStepNavigatorButton
              type="primary"
              htmlType="submit"
              //icon={<RightOutlined />}
              disabled={currentStep === 3 || currentStep === steps.length - 1 || currentStep === steps.length - 2}>
                Seuraava
            </StyledStepNavigatorButton>
          </Form.Item>
        </StyledStepNavigators>
        <StyledDoneContainer>
          {landmassData !== null && landmassData.id && currentStep === 0 &&
            <StyledStepNavigatorButton
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setModalContent({
                id: landmassData.id,
                action: "deleteLandmassAreaById",
                title: "Poista maamassakohde",
                message: "Varoitus",
                description: "Haluatko varmasti poistaa maamassakohteen ja kaikki sille määritetyt maamassatiedot?",
                loading: false
              });
            }}
            >
              Poista kohde
            </StyledStepNavigatorButton>
          }
          { currentStep === steps.length - 2 && <StyledStepNavigatorButton
            type="primary" 
            htmlType="submit"
            icon={<SaveOutlined />}
           // disabled={ currentStep != steps.length - 2 || currentStep === steps.length - 1}
           //disabled={ currentStep != steps.length - 2 }
          >
              Tallenna
          </StyledStepNavigatorButton>}
          {/* <StyledStepNavigatorButton type="primary"  htmlType="submit" disabled={ currentStep != steps.length - 1}>
              Tallenna ja sulje
          </StyledStepNavigatorButton> */}
        </StyledDoneContainer>
      </StyledStepsAction>
      <StyledBottomText>
        Käyttämällä SeutuMassa-palvelua annat HSY:lle luvan tallentaa tietosi rekisteriimme sekä jakaa niitä muille palvelun käyttäjille.
      </StyledBottomText>
      </Form>
      <Modal
        title={modalContent && modalContent.title ? modalContent.title : ""}
        visible={modalContent !== null ? true : false}
        onCancel={() => setModalContent(null)}
        footer={[
          <Button
            key="back"
            onClick={() => setModalContent(null)}
          >Peruuta
          </Button>,
          <Button
          key="submit"
          type="primary"
          loading={modalContent && modalContent.loading ? true : false}
          onClick={() => {
            handleModalSubmitActions();
          }}>
            Poista
          </Button>
        ]}
      >
      <Alert
        message={modalContent && modalContent.message ? modalContent.message : ""}
        description={modalContent && modalContent.description ? modalContent.description : ""}
        type="warning"
        showIcon
      />
      </Modal>
    </>
  );
};

StepWizard.propTypes = {
 
};

export default StepWizard;

// const contextWrap = LocaleConsumer(StepWizard);
// export { contextWrap as StepWizard };