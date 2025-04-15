import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { Modal, Alert, Result, Form, Table, Popover, ConfigProvider, DatePicker, Spin, Select, Switch, Steps, Button, Input, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined, SaveOutlined, DeleteOutlined} from '@ant-design/icons';

import moment from 'moment';

//import 'moment/locale/fi.js';
//import '../../../../node_modules/moment/locale/fi.js';

import locale from 'antd/es/date-picker/locale/fi_FI';
const localeFi = {
  ...locale,
  lang: {
    ...locale.lang,
    shortMonths: [
      "Tammi",
      "Helmi",
      "Maalis",
      "Huhti",
      "Touko",
      "Kesä",
      "Heinä",
      "Elo",
      "Syys",
      "Loka",
      "Marras",
      "Joulu"
    ]
  }
};

import '../../resources/css/styles.css';
import 'antd/es/date-picker/style/index.css';
// import 'antd/dist/antd.css';

/* API */
import {
  addLandmassArea,
  updateLandmassArea,
  deleteLandmassAreaById,
  getLandmassProjects
} from '../../resources/api/SeutumassaLandmassApi.js';

import { inputFields } from '../../resources/inputFields.js';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

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
    selectedLandmassArea,
    setSelectedLandmassArea,
    handleResetLandmassTool,
    handleMapRefresh,
    config
}) => {

const [form] = Form.useForm();
const selectedMunicipality = Form.useWatch('kunta', form);

const [modalContent, setModalContent] = useState(null);
const [landmassProjects, setLandmassProjects] = useState([]);
const [inputDefinitionGroups, setInputDefinitionGroups] = useState(inputFields);

const [successMessage, setSuccessMessage] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [currentStep, setCurrentStep] = useState(0);

useEffect(() => {
  const fetchProjects = async () => {
    const resp = await getLandmassProjects();
    const json = await resp.json();
    setLandmassProjects(json);
  };
  fetchProjects();
}, []);

useEffect(() => {
  const defs = landmassProjects.length && selectedMunicipality && selectedMunicipality.length
    ? inputFields.map(group =>
      group.map(x => addLandmassProjectsToInputDefinition(landmassProjects, selectedMunicipality, x))
    )
    : inputFields;
  setInputDefinitionGroups(defs);
  const hankealueId = form.getFieldValue('hankealue_id');
  if (selectedMunicipality && hankealueId && landmassProjects.length && !landmassProjects.some(x => x.id === hankealueId && x.kunta === selectedMunicipality)) {
    form.setFieldValue('hankealue_id', -1);
  }
}, [landmassProjects, selectedMunicipality]);

function addLandmassProjectsToInputDefinition(landmassProjects, selectedMunicipality, inputDefinition) {
  if (inputDefinition.id !== 'hankealue_id') {
    return inputDefinition;
  }
  return {
    ...inputDefinition,
    values: [
      ...inputDefinition.values,
      ...landmassProjects
        .filter(x => x.kunta === selectedMunicipality)
        .map(({ id, nimi }) => ({ id, title: nimi }))
    ]
  }
}

async function handleDeleteSelectedLandmassArea() {
  const id = selectedLandmassArea.id;
  if (!id) {
    return;
  }
  const resp = await deleteLandmassAreaById(id);
  if (!resp.ok) {
    // TODO: Handle errors
    return;
  }
  handleMapRefresh();
  handleResetLandmassTool();
};

async function handleDeleteLandmassDataById(id) {
  const formData = form.getFieldsValue(true);
  const area = createLandmassAreaFromFormData(formData);
  const data = selectedLandmassArea.data.filter(x => x.maamassatieto_id !== id);
  area.data = data;
  // Stringify geojson geometry for the API
  area.geom = JSON.stringify(area.geom);

  try {
    const response = await updateLandmassArea(area);
    if (!response.ok) {
      throw new Error("Response status " + response.status);
    }
    const body = await response.json();
    setSelectedLandmassArea(body);
    // form does not need to be updated
  } catch (e) {
    console.error(e);
  } finally {
    setModalContent(null);
  }
}

async function handleModalSubmitActions() {
  setModalContent({...modalContent, loading: true});
  modalContent.onOk(modalContent.id);
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
      amount_unit: null,
      vertical_position: null,
      lisatieto: null,
      liitteet: null,
      varattu: null,
      pilaantuneisuus: null,
      tiedon_luotettavuus: null,
      maamassan_tila: null,
      maamassan_ryhma: null,
      maamassan_laji: null
    });
    handleNext();
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
  form.setFieldsValue(data);
  handleNext(data);
}

const handleNext = async () => {
  if (currentStep == 2) {
    const formData = form.getFieldsValue(true);
    if (isLandMassAreaDirty(selectedLandmassArea, formData)) {
      await handleSaveLandmassArea(formData);
    }
  } else if (currentStep == steps.length - 2) {
    await handleSaveAndAddNewLandmassData(form.getFieldsValue(true));
  }
  setCurrentStep(currentStep + 1);
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
        <p>Kunta: {config?.municipalities?.find(x => x.id === maamassakohde.kunta)?.label ?? "-"}</p>
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
        <p>Massan yksikkö: {maamassatieto.amount_unit || "-"}</p>
        <p>Vertikaalinen sijainti: {maamassatieto.vertical_position || "-"}</p>
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

const isLandMassAreaDirty = (selectedLandmassArea, formData) => {
  if (!selectedLandmassArea || !formData) {
    return false;
  }
  const areaProperties = [
    "id", "kunta", "hankealue_id", "nimi", "osoite", "kohdetyyppi", "vaihe",
    "omistaja_id", "henkilo_email", "henkilo_nimi", "henkilo_organisaatio", "henkilo_puhelin"
  ];
  // Compare these as iso strings
  const areaDateProperties = ["alku_pvm", "loppu_pvm"];
  return areaProperties.some(prop => selectedLandmassArea[prop] !== formData[prop]) ||
    areaDateProperties.some(prop => selectedLandmassArea[prop]?.toISOString() !== formData[prop]?.toISOString());
}

const createLandmassAreaFromFormData = (formData) => ({
  id: formData.id,
  geom: formData.geom,
  kunta: formData.kunta,
  hankealue_id: formData.hankealue_id != -1 ? formData.hankealue_id : null,
  nimi: formData.nimi,
  osoite: formData.osoite,
  kohdetyyppi: formData.kohdetyyppi,
  vaihe: formData.vaihe,
  omistaja_id: formData.omistaja_id,
  henkilo_email: formData.henkilo_email,
  henkilo_nimi: formData.henkilo_nimi,
  henkilo_organisaatio: formData.henkilo_organisaatio,
  henkilo_puhelin: formData.henkilo_puhelin,
  alku_pvm: formData.alku_pvm?.toISOString(),
  loppu_pvm: formData.loppu_pvm?.toISOString()
});

const createLandmassDataFromFormData = (formData) => ({
  maamassatieto_id: formData.maamassatieto_id,
  maamassakohde_id: formData.maamassakohde_id,
  kelpoisuusluokkaryhma: formData.kelpoisuusluokkaryhma,
  kelpoisuusluokka: formData.kelpoisuusluokka,
  tiedontuottaja: formData.tiedontuottaja,
  planned_begin_date: formData.planned_begin_date?.toISOString(),
  planned_end_date: formData.planned_end_date?.toISOString(),
  realized_begin_date: formData.realized_begin_date?.toISOString(),
  realized_end_date: formData.realized_end_date?.toISOString(),
  amount_remaining: formData.amount_remaining,
  amount_unit: formData.amount_unit,
  vertical_position: formData.vertical_position,
  lisatieto: formData.lisatieto,
  liitteet: formData.liitteet,
  varattu: formData.varattu || false,
  pilaantuneisuus: formData.pilaantuneisuus,
  tiedon_luotettavuus: formData.tiedon_luotettavuus,
  maamassan_tila: formData.maamassan_tila,
  maamassan_ryhma: formData.maamassan_ryhma,
  maamassan_laji: formData.maamassan_laji,
});

const handleSaveLandmassArea = async (formData) => {
  const area = createLandmassAreaFromFormData(formData);
  area.id = selectedLandmassArea.id;
  // Don't touch data
  area.data = selectedLandmassArea.data ?? [];

  // Stringify geojson geometry for the API
  area.geom = JSON.stringify(area.geom);

  const request = !area.id ? addLandmassArea(area) : updateLandmassArea(area);
  setIsLoading(true);
  try {
    const response = await request;
    if (!response.ok) {
      throw new Error("Response status " + response.status);
    }
    const body = await response.json();
    setSelectedLandmassArea(body);
    handleMapRefresh();
  } catch (e) {
    console.error(e);
  }
  setIsLoading(false);
};

const handleSaveAndAddNewLandmassData = async (formData) => {
  const area = createLandmassAreaFromFormData(formData);
  const data = createLandmassDataFromFormData(formData);
  area.id = selectedLandmassArea.id;
  area.data = selectedLandmassArea.data ? [...selectedLandmassArea.data] : [];
  if (!data.maamassatieto_id) {
    area.data.push(data);
  } else {
    const i = area.data.findIndex((x) => x.maamassatieto_id === data.maamassatieto_id);
    area.data[i] = data;
  }

  // Stringify geojson geometry for the API
  area.geom = JSON.stringify(area.geom);

  const request = !area.id ? addLandmassArea(area) : updateLandmassArea(area);
  setIsLoading(true);
  try {
    const response = await request;
    if (!response.ok) {
      throw new Error("Response status " + response.status);
    }
    const body = await response.json();
    setSelectedLandmassArea(body);
    handleSuccessMessage(area, data);
  } catch (e) {
    console.error(e);
  }
  setIsLoading(false);
};

const SelectorFormItem = ({id, name, description, placeholder, rules, enumDefinitions, value}) => {
 const user = Oskari.user();
  
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
          disabled={!user.hasRole(config.municipalities.find(m => m.id === enumDefinition.id)?.roles) ?? true}
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

const TableFormItem = ({columns, data, description}) => (
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
        locale={localeFi}
        popupStyle={{zIndex: '999999'}}
        picker={type}
        placeholder="Valitse kuukausi"
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
      title: 'Kohteen massaerät',
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
        {steps.map((step) =>
          <Step
            key={step.title}
            title={<StyledStepTitle>{step.title}</StyledStepTitle>}
            description={step.description}
            />
        )}
      </Steps>
      <Form
        {...layout}
        form={form}
        initialValues={selectedLandmassArea}
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
                        amount_unit: null,
                        vertical_position: null,
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
          {inputDefinitionGroups[currentStep] !== undefined && inputDefinitionGroups[currentStep].map(inputDefinitionGroup => {
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
                              title: "Poista maamassatieto",
                              message: "Varoitus",
                              description: "Haluatko varmasti poistaa maamassatiedon?",
                              loading: false,
                              onOk: () => handleDeleteLandmassDataById(record.maamassatieto_id)
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
                    key: "th_amount_unit",
                    title: 'Yksikkö',
                    dataIndex: 'amount_unit',
                    //align: 'left',
                    width: 60,
                  },
                  {
                    key: "th_vertical_position",
                    title: 'Vertikaalinen sijainti',
                    dataIndex: 'vertical_position',
                    //align: 'left',
                    width: 60,
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
                  data={selectedLandmassArea.data}                  
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
            >
                  Edellinen
            </StyledStepNavigatorButton>
          </Form.Item>
          <Form.Item>
            <StyledStepNavigatorButton
              type="primary"
              htmlType="submit"
              disabled={currentStep === 2 || currentStep === 3 || currentStep === steps.length - 1 || currentStep === steps.length - 2}>
                Seuraava
            </StyledStepNavigatorButton>
          </Form.Item>
        </StyledStepNavigators>
        <StyledDoneContainer>
          {selectedLandmassArea?.id && currentStep === 0 &&
            <StyledStepNavigatorButton
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setModalContent({
                id: selectedLandmassArea.id,
                title: "Poista maamassakohde",
                message: "Varoitus",
                description: "Haluatko varmasti poistaa maamassakohteen ja kaikki sille määritetyt maamassatiedot?",
                loading: false,
                onOk: handleDeleteSelectedLandmassArea
              });
            }}
            >
              Poista kohde
            </StyledStepNavigatorButton>
          }
          {(currentStep === 2 || currentStep === steps.length - 2) &&
            <StyledStepNavigatorButton type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Tallenna
            </StyledStepNavigatorButton>
          }
        </StyledDoneContainer>
      </StyledStepsAction>
      <StyledBottomText>
        Käyttämällä SeutuMassa-palvelua annat HSY:lle luvan tallentaa tietosi rekisteriimme sekä jakaa niitä muille palvelun käyttäjille.
      </StyledBottomText>
      </Form>
      <Modal
        zIndex={999999}
        title={modalContent && modalContent.title ? modalContent.title : ""}
        open={modalContent !== null}
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
          loading={modalContent && modalContent.loading}
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

export default StepWizard;
