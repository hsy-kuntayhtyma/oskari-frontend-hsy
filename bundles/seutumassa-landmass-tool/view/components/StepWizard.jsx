import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form, Table, Popover, DatePicker, Tag, Space, Select, Switch, Steps, Button, Input, InputNumber, message, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Controller, LocaleConsumer } from 'oskari-ui/util';

import moment from 'moment';

//import 'moment/locale/fi.js';
//import '../../../../node_modules/moment/locale/fi.js';
import locale from 'antd/es/date-picker/locale/fi_FI';

import '../../resources/css/styles.css';
import 'antd/dist/antd.css';
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
  min-height: 500px;
  min-width: 900px;
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
  margin-bottom: 0;
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

const StepWizard = ({
    currentStep,
    setCurrentStep,
    inputDefinitions,
    landmassData,
    setLandmassData,
    landmassDataTable,
    setLandmassDataTable,
    handleSaveAndAddNewLandmassData,
    handleSaveAndClose,
    handleResetLandmassTool
}) => {

const [form] = Form.useForm();
//const [currentStep, setCurrentStep] = useState(0);

const handleNewLandmassData = () => {
    form.setFieldsValue({
      maamassatieto_id: null,
      maamassakohde_id:  null,
      kelpoisuusluokkaryhma: null,
      kelpoisuusluokka:  null,
      tiedontuottaja_id: null,
      planned_begin_date:  null,
      planned_end_date: null,
      realized_begin_date: null,
      realized_end_date: null,
      amount_total:  null,
      amount_remaining: null,
      lisatieto: null,
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
  //console.log(form.getFieldsValue(true));
  //console.log(values);
  if(currentStep < steps.length - 1) {
    setCurrentStep(currentStep + 1);
    form.setFieldsValue(values);
  } else { // All steps are done and required field filled. -> Save data to database.
    console.log("Save data here");
    handleSaveAndAddNewLandmassData(form.getFieldsValue(true));
  }
};

const onNextFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const handlePrevious = () => {
  currentStep > 0 ? setCurrentStep(currentStep - 1) : handleResetLandmassTool();
};

const SelectorFormItem = ({id, name, description, placeholder, rules, enumDefinitions, value}) => {
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
      {enumDefinitions.map((enumDefinition, index) => {
        return (
          <Option
            key={enumDefinition.title+'_' + index}
            value={enumDefinition.id}
          >
            {enumDefinition.title}
          </Option>
        )
      })}
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
        scroll={{ x: 1500, y: 600 }}
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
  ];

  return (
    <>
      <Steps current={currentStep} size="small" >
        {steps.map(step =>
          <Step
            key={step.title}
            title={<StyledStepTitle>{step.title}</StyledStepTitle>}
            //icon={<LoadingOutlined />}
            description={step.description}
            />
        )}
      </Steps>
      <Divider />
      <Form
        {...layout}
        form={form}
        initialValues={landmassData}
        onFinish={handleNext}
        onFinishFailed={onNextFailed}
      >
      <StyledStepsContent>
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
        </StyledStepsContent>
      <StyledStepsAction>
        <StyledStepNavigators>
          <Form.Item>
            <StyledStepNavigatorButton onClick={() => {
                handlePrevious();
                }}>
                  Edellinen
            </StyledStepNavigatorButton>
          </Form.Item>
          <Form.Item>
            <StyledStepNavigatorButton type="primary" htmlType="submit" disabled={currentStep === 3 || currentStep === steps.length - 1 }>
                Seuraava
            </StyledStepNavigatorButton>
          </Form.Item>
        </StyledStepNavigators>
        <StyledDoneContainer>
          <StyledStepNavigatorButton type="primary"  htmlType="submit" disabled={ currentStep != steps.length - 1}>
              Tallenna ja lisää uusi tieto
          </StyledStepNavigatorButton>
          {/* <StyledStepNavigatorButton type="primary"  htmlType="submit" disabled={ currentStep != steps.length - 1}>
              Tallenna ja sulje
          </StyledStepNavigatorButton> */}
        </StyledDoneContainer>
      </StyledStepsAction>
      </Form>
    </>
  );
};

StepWizard.propTypes = {
 
};

export default StepWizard;

// const contextWrap = LocaleConsumer(StepWizard);
// export { contextWrap as StepWizard };