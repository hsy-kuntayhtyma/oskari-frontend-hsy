import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form, Table, Tag, Space, Select, Steps, Button, Input, InputNumber, DatePicker, message, Divider } from 'antd';
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined } from '@ant-design/icons';
import { Controller, LocaleConsumer } from 'oskari-ui/util';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const { Column, ColumnGroup } = Table;

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

const StyledFormItem = styled(Form.Item)`
  padding-bottom: 10px;
`;

const StyledFormItemLabel = styled.p`
  margin: 0;
  padding: 0;
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

  tbody {
    tr {
      transition: all 0.3s ease-out;
      &:hover {
        background-color: #e9e9e9;
      }
    }
  }

  th {
   text-align: left;
  }
  td {
    padding: 0;
    vertical-align: middle;
  }
  
  //border: none;
`;

const StyledColumn = styled(Column)`
  background-color: blue;
`;

const StyledTableAddDataButton = styled(Button)`
  margin-top: 20px;
`;

const StyledSelector = styled(Select)`
  width: 100%;
`;

const StyledStepNavigatorButton = styled(Button)`
  margin-right: 10px;
  min-width: 85px;
`;

const StepWizard = ({
    inputDefinitions,
    landmassData,
    setLandmassData,
    landmassDataTable,
    setLandmassDataTable,
    handleResetLandmassTool
}) => {


  //console.log(landmassData);
//wait process finish error

const [form] = Form.useForm();
const [currentStep, setCurrentStep] = useState(0);

const handleNext = (values) => {
  console.log(form.getFieldsValue(true));
  console.log(values);
  if(currentStep < steps.length - 1) {
    setCurrentStep(currentStep + 1);
    form.setFieldsValue(values);
  } else {
    console.log("Save data here");
    //console.log(form.getFieldsValue());
    // All steps are done and required field filled. -> Save data to database.
  }
};

const onNextFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const handlePrevious = () => {
  currentStep > 0 ? setCurrentStep(currentStep - 1) : handleResetLandmassTool();
};

const SelectorFormItem = ({id, name, placeholder, rules, enumDefinitions, value}) => {
  return <StyledFormItem
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
            value={enumDefinition.title}
          >
            {enumDefinition.title}
          </Option>
        )
      })}
    </StyledSelector>
  </StyledFormItem>
};

const TableFormItem = ({columns, data, handleNext}) => (
    <StyledTableContainer>
      <StyledTable
        scroll={{ x: 1500, y: 300 }}
        columns={columns}
        dataSource={data}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              handleNext(record);
            } // click row
            //onDoubleClick: event => {}, // double click row
            //onContextMenu: event => {}, // right button click row
            //onMouseEnter: event => {}, // mouse enter row
            //onMouseLeave: event => {}, // mouse leave row
          };
        }}
      >

      </StyledTable>
    <StyledTableAddDataButton onClick={() => handleNext({})}>LISÄÄ UUSI TIETO</StyledTableAddDataButton>
    </StyledTableContainer>
);

const NumberFormItem = ({id, name, rules}) => (
  <StyledFormItem
    name={id}
    label={name}
    rules={rules}
  >
    <InputNumber />
  </StyledFormItem>
);

const DateFormItem = ({id, name, rules, type}) => (
  <StyledFormItem
    name={id}
    label={name}
    rules={rules}
  >
    {/* <DatePicker picker={type} locale={'fi_FI'}/> */}
    {/* <Input type={type} locale={'fi_FI'}/> */}
    <input type={type} />
  </StyledFormItem>
);

const TextInputFormItem = ({id, name, placeholder, rules}) => (
  <StyledFormItem
    name={id}
    label={name}
    rules={rules}
  >
    <Input placeholder={placeholder}/>
  </StyledFormItem>
);

const TextAreaFormItem = ({id, name, placeholder, rules}) => (
  <StyledFormItem
    name={id}
    label={name}
    rules={rules}
  >
    <TextArea style={{resize: 'vertical'}} placeholder={placeholder}/>
  </StyledFormItem>
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
                  name={<StyledFormItemLabel>{inputDefinitionGroup.title}</StyledFormItemLabel>}
                  placeholder={inputDefinitionGroup.placeHolderText}
                  rules={[{ required: false }]}
                  enumDefinitions={inputDefinitionGroup.values}
                />
              } else if (inputDefinitionGroup.type === 'table'){
                const columns = [
                  {
                    key: 'th_id',
                    title: 'Id',
                    dataIndex: 'id',
                    //align: 'left',
                    width: 40,
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
                    key: "th_kelpoisuusluokkaryhma",
                    title: 'Kelpoisuusluokkaryhmä',
                    dataIndex: 'kelpoisuusluokkaryhma',
                    //align: 'left',
                    width: 150,
                    //fixed: 'left'
                  },
                  {
                    key: "th_kelpoisuusluokka",
                    title: 'Kelpoisuusluokka',
                    dataIndex: 'kelpoisuusluokka',
                    //align: 'left',
                    //width: 130,
                    //fixed: 'left'
                  },
                  {
                    key: "th_maamassan_tila",
                    title: 'Maamassatila',
                    dataIndex: 'maamassan_tila',
                    //align: 'left',
                    //width: 150,
                    //fixed: 'left'
                  },
                  {
                    key: "th_amount_total",
                    title: 'Maassaa yhteensä',
                    dataIndex: 'amount_total',
                    //align: 'left',
                    //width: 130,
                    //fixed: 'left'
                  },
                  {
                    key: "th_amount_remaining",
                    title: 'Massaaa jäljellä',
                    dataIndex: 'amount_remaining',
                    //align: 'left',
                  },
                  {
                    key: "th_luotu",
                    title: 'Luotu',
                    dataIndex: 'luotu',
                    //align: 'left',
                  },
                  {
                    key: "th_muokattu",
                    title: 'Muokattu',
                    dataIndex: 'muokattu',
                    //align: 'left',
                  },
                ];
                
                return <TableFormItem
                  key={inputDefinitionGroup.id}
                  columns={columns}
                  data={landmassDataTable}
                  handleNext={handleNext}
                  setLandmassData={setLandmassData}
                />
              } else if (inputDefinitionGroup.type === 'number'){
                return <NumberFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={<StyledFormItemLabel>{inputDefinitionGroup.title}</StyledFormItemLabel>}
                  rules={[{ required: false }]}
                />
              } else if (inputDefinitionGroup.type === 'month'){
                return <DateFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={<StyledFormItemLabel>{inputDefinitionGroup.title}</StyledFormItemLabel>}
                  rules={[{ required: false }]}
                  type={inputDefinitionGroup.type}
                />
              } else if (inputDefinitionGroup.type === 'textfield'){
                return <TextInputFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={<StyledFormItemLabel>{inputDefinitionGroup.title}</StyledFormItemLabel>}
                  placeholder={inputDefinitionGroup.title}
                  rules={[{ required: false }]}
                />
              } else if (inputDefinitionGroup.type === 'email'){
                return <TextInputFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={<StyledFormItemLabel>{inputDefinitionGroup.title}</StyledFormItemLabel>}
                  placeholder={inputDefinitionGroup.title}
                  rules={[{ required: false, type:'email' }]}
                />
              } else if (inputDefinitionGroup.type === 'textarea'){
                return <TextAreaFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={<StyledFormItemLabel>{inputDefinitionGroup.title}</StyledFormItemLabel>}
                  placeholder={inputDefinitionGroup.title}
                  rules={[{ required: false }]}
                />
              }
          })}
         </StyledSelectorGroup>
        </StyledStepsContent>
      <StyledStepsAction>
        <StyledStepNavigators>
          <Form.Item>
            <StyledStepNavigatorButton onClick={() => {
                handlePrevious();
                }}>
                  Previous
            </StyledStepNavigatorButton>
          </Form.Item>
          <Form.Item>
            <StyledStepNavigatorButton type="primary" htmlType="submit" disabled={currentStep === 3 || currentStep === steps.length - 1 }>
                Next
            </StyledStepNavigatorButton>
          </Form.Item>
        </StyledStepNavigators>
        <StyledDoneContainer>
          <StyledStepNavigatorButton type="primary"  htmlType="submit" disabled={ currentStep != steps.length - 1}>
              Save and add new
          </StyledStepNavigatorButton>
          <StyledStepNavigatorButton type="primary"  htmlType="submit" disabled={ currentStep != steps.length - 1}>
              Save
          </StyledStepNavigatorButton>
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