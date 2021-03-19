import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form, Select, Steps, Button, Input, InputNumber, DatePicker, message, Divider } from 'antd';
import { Controller, LocaleConsumer } from 'oskari-ui/util';

import inputDefinitions from '../inputDefinitions.js';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const StyledStepsContent = styled.div`
  min-height: 400px;
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

const StyledDoneContainer = styled.div`

`;

const StyledSelectorGroup = styled.div`
  
`;

const StyledFormItem = styled(Form.Item)`
  padding-bottom: 10px;
`;

const StyledSelector = styled(Select)`
  width: 100%;
`;

const StyledButton = styled(Button)`
  margin-right: 10px;
  min-width: 85px;
`;

const StepWizard = ({
    inputDefinitions,
    landMassData,
    setLandMassData
}) => {
  
  //wait process finish error
//const [wizardStatus, setWizardStatus] = useState();
const [form] = Form.useForm();
const [currentStep, setCurrentStep] = useState(0);

//console.log(inputDefinitions()[currentStep]);

const handleNext = (values) => {
  if(currentStep < steps.length - 1) {
    setCurrentStep(currentStep + 1);
  } else {
    // All steps are done and required field filled. -> Save data to database.

  }
};

const onNextFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const handlePrevious = () => {
    currentStep > 0 ?  setCurrentStep(currentStep - 1) : setLandMassData(null);
};

const SelectorFormItem = ({id, name, placeholder, rules, enumDefinitions}) => (
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
            value={enumDefinition.title}
          >
            {enumDefinition.title}
          </Option>
        )
      })}
    </StyledSelector>
  </StyledFormItem>
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

const DateFormItem = ({id, name, rules}) => (
  <StyledFormItem
    name={id}
    label={name}
    rules={rules}
  >
    <input type="date"/>
  </StyledFormItem>
);

const TextInputFormItem = ({id, name, rules}) => (
  <StyledFormItem
    name={id}
    label={name}
    rules={rules}
  >
    <Input placeholder={name}/>
  </StyledFormItem>
);

const TextAreaFormItem = ({id, name, rules}) => (
  <StyledFormItem
    name={id}
    label={name}
    rules={rules}
  >
    <TextArea style={{resize: 'vertical'}} placeholder={name}/>
  </StyledFormItem>
);

const steps = [
    {
      title: 'Step 1',
      description: 'Step 1 description',
    },
    {
      title: 'Step 2',
      description: 'Step 2 description',
    },
    {
      title: 'Step 3',
      description: 'Step 3 description',
    },
    {
      title: 'Step 4',
      description: 'Step 4 description',
    },
    {
      title: 'Step 5',
      description: 'Step 5 description',
    },
  ];

  return (
    <>
      <Steps current={currentStep}>
        {steps.map(step =>
          <Step key={step.title} title={step.title} description={step.description}/>
        )}
      </Steps>
      <Divider />
      <Form
        {...layout}
        form={form}
        initialValues={landMassData}
        onFinish={handleNext}
        onFinishFailed={onNextFailed}
      >
      <StyledStepsContent>
         <StyledSelectorGroup>
          {inputDefinitions[currentStep] !== undefined && inputDefinitions[currentStep].map(inputDefinitionGroup => {
              if(inputDefinitionGroup.type === 'select'){
                console.log(inputDefinitionGroup.id);
                return <SelectorFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={inputDefinitionGroup.title}
                  placeholder={inputDefinitionGroup.placeHolderText}
                  rules={[{ required: false }]}
                  enumDefinitions={inputDefinitionGroup.values}
                  value={landMassData.hasOwnProperty(inputDefinitionGroup.id) && landMassData[inputDefinitionGroup.id]}
                />
              } else if(inputDefinitionGroup.type === 'number'){
                return <NumberFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={inputDefinitionGroup.title}
                  rules={[{ required: false }]}
                />
              } else if(inputDefinitionGroup.type === 'date'){
                return <DateFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={inputDefinitionGroup.title}
                  rules={[{ required: false }]}
                />
              } else if(inputDefinitionGroup.type === 'textfield'){
                return <TextInputFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={inputDefinitionGroup.title}
                  placeholder={inputDefinitionGroup.placeHolderText}
                  rules={[{ required: false }]}
                />
              } else if(inputDefinitionGroup.type === 'email'){
                return <TextInputFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={inputDefinitionGroup.title}
                  placeholder={inputDefinitionGroup.placeHolderText}
                  rules={[{ required: false, type:'email' }]}
                />
              } else if(inputDefinitionGroup.type === 'textarea'){
                return <TextAreaFormItem
                  key={inputDefinitionGroup.id}
                  id={inputDefinitionGroup.id}
                  name={inputDefinitionGroup.title}
                  placeholder={inputDefinitionGroup.placeHolderText}
                  rules={[{ required: false }]}
                />
              }
          })}
         </StyledSelectorGroup>
        </StyledStepsContent>
      <StyledStepsAction>
        <StyledStepNavigators>
          <StyledButton disabled={landMassData === null} onClick={() => {
            handlePrevious();
          }}>
              Previous
          </StyledButton>
          <Form.Item>
            <StyledButton type="primary" htmlType="submit" disabled={currentStep === steps.length - 1}>
                Next
            </StyledButton>
          </Form.Item>
        </StyledStepNavigators>
        <StyledDoneContainer>
        </StyledDoneContainer>
        <StyledButton type="primary"  htmlType="submit" disabled={ currentStep != steps.length - 1}>
            Save
        </StyledButton>
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