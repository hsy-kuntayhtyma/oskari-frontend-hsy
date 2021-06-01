import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';
import { Result, Button, Spin, Space } from 'antd';
import { GatewayOutlined, EnvironmentOutlined, AimOutlined, FileOutlined } from '@ant-design/icons';

const fadeBorder = keyframes`
  0% {
    transform: scale(1);
    background-image: linear-gradient(rgb(0, 135, 130) 20%, #00AAA3 90%) !important;
    border-color: #00A2AA;
    box-shadow: 0px 5px 10px -8px rgb(0 0 0 / 77%);
  }
  50% {
    transform: scale(1.02);
    border-color: #cacaca;
    box-shadow: 0px 7px 15px -4px rgb(0 0 0 / 80%);
  }
  100% {
    transform: scale(1);
    border-color: #00A2AA;
    box-shadow: 0px 5px 10px -8px rgb(0 0 0 / 77%);
  }
`

const StyledActionSelectorContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 400px;
`;
//    animation: ${props => props.active === "true" ? "1s " +fadeBorder+ " ease-out infinite" : "none"};
const StyledButton = styled(Button)`
    position: relative !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    animation: ${props => (props.active === 'true' ? css`${fadeBorder} 1.5s ease-in infinite` : '')};
    min-width: 250px !important;
    height: 50px !important;
    margin: 10px !important;
    border-radius: 5px !important;
    box-shadow: ${props => props.active === "true" ? "0px 5px 6px -10px rgb(0 0 0 / 77%) !important" : "0px 5px 10px -8px rgb(0 0 0 / 77%) !important"};
    background-color: ${props => props.active === "true" && "#00AAA3 !important"};
    color: ${props => props.active === "true" ? "#fafafa !important" : "#3c3c3c !important"};
    &:hover {
        transform: scale(1.02);
        background-color: #00AAA3 !important;
        background-image: linear-gradient(rgb(0, 135, 130) 20%, #00AAA3 90%) !important;
        border-color: #00A2AA !important;
    }
    &:focus {
        color: ${props => props.active === "true" ? "#fafafa !important" : "#3c3c3c !important"};
        background-color: #fff !important;
        background-image:  ${props => props.active === "true" ? "linear-gradient(#008782 20%, #00AAA3 90%) !important" : "#fafafa"};
        //border-color: #00A2AA !important;
    }
`;


const ActionSelector = ({
    isLoading,
    actionSelectorState,
    setActionSelectorState,
    handleSelectGeometry,
    handleDrawNewGeometry,
    handleDownloadShapeFile
}) => {

    useEffect(() => {
        Oskari.getSandbox().postRequestByName('DrawTools.StopDrawingRequest', ['newGeometry', true]);
    },[]);

    const buttons = [
        {
            id:"action_selector_1",
            name: "Piirrä uusi alue",
            icon: <GatewayOutlined style={{ fontSize: '20px' }}/>,
            onClick: () => {
                handleDrawNewGeometry('Polygon');
            },
            active: actionSelectorState === 1 ? "true" : "false",
            disabled: false
        },
        {
            id:"action_selector_2",
            name: "Lisää uusi piste",
            icon: <EnvironmentOutlined style={{ fontSize: '20px' }} />,
            onClick: () => {
                handleDrawNewGeometry('Point');
            },
            active: actionSelectorState === 2 ? "true" : "false",
            disabled: false
        },
        {
            id:"action_selector_3",
            name: "Valitse kohde",
            icon: <AimOutlined style={{ fontSize: '20px' }} />,
            onClick: () => {
                handleSelectGeometry();
            },
            active: actionSelectorState === 3 ? "true" : "false",
            disabled: false
        },
        {
            id:"action_selector_4",
            name: "Lataa shapefile",
            icon: <FileOutlined style={{ fontSize: '20px' }} />,
            onClick: () => {
                handleDownloadShapeFile();
            },
            active: actionSelectorState === 4 ? "true" : "false",
            disabled: false
        }
    ];

    return (
    <StyledActionSelectorContainer>
        { isLoading ? <Space size="middle">
            <Spin size="large" />
        </Space> : actionSelectorState === -1 ? <Result
           title="Käyttöoikeutesi eivät riitä tiedon muokkaamiseen"
           extra={
             <Button type="primary" key="console" onClick={() => setActionSelectorState(0)}>
               Sulje
             </Button>
           }
           /> : actionSelectorState === -2 ? <Result
           title="Haluatko varmasti sulkea tietojen syötön?"
           extra={
             <Button type="primary" key="console" onClick={() => setActionSelectorState(0)}>
               Sulje
             </Button>
           }
           /> : buttons.map(button => (
            <StyledButton
                disabled={button.disabled}
                key={button.id} icon={button.icon}
                onClick={button.onClick}
                active={button.active}>{button.name}
            </StyledButton>
            ))
        }
    </StyledActionSelectorContainer>
    );
};

export default ActionSelector;