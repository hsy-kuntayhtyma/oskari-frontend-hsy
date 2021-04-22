import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Spin, Space } from 'antd';

const StyledActionSelectorContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 400px;
`;

const StyledButton = styled(Button)`
    body {
        cursor: pointer !important;
    }
    min-width: 250px;
    height: 50px;
    margin: 10px;
    border-radius: 5px;
    box-shadow: ${props => props.active === "true" ? "0px 5px 6px -10px rgb(0 0 0 / 77%)" : "0px 5px 10px -8px rgb(0 0 0 / 77%)"};
    background-color: ${props => props.active === "true" && "#00AAA3"};
    color: ${props => props.active === "true" ? "#fafafa" : "#3c3c3c"};
    &:hover:active {
        background-color: #00AAA3 !important;
        background-image: linear-gradient(#008782 20%, #00AAA3 90%) !important;
        border-color: #00A2AA !important;
    }
    &:focus {
        background-color: #fff !important;
        background-image: linear-gradient(#008782 20%, #00AAA3 90%) !important;
        border-color: #00A2AA !important;
    }
`;


const ActionSelector = ({
    isLoading,
    actionSelectorState,
    handleSelectGeometry,
    handleDrawNewGeometry,
    handleDownloadShapeFile
}) => {

    const buttons = [
        {
            id:"action_selector_1",
            name: "Lisää uusi alue",
            onClick: () => {
                handleDrawNewGeometry();
            },
            active: actionSelectorState === 1 ? "true" : "false"
        },
        {
            id:"action_selector_2",
            name: "Valitse alue",
            onClick: () => {
                handleSelectGeometry();
            },
            active: actionSelectorState === 2 ? "true" : "false"
        },
        {
            id:"action_selector_3",
            name: "Lataa shapefile",
            onClick: () => {
                handleDownloadShapeFile();
            },
            active: actionSelectorState === 3 ? "true" : "false"
        }
    ];

    return (
    <StyledActionSelectorContainer>
        {/* <StyledButton onClick={() => handleDrawNewGeometry()}>Lisää uusi alue</StyledButton>
        <StyledButton onClick={() => handleSelectGeometry()}>Valitse alue</StyledButton>
        <StyledButton onClick={() => handleDownloadShapeFile()}>Lataa shapefile</StyledButton> */}
        
        {
        isLoading ?
        <Space size="middle">
            <Spin size="large" />
        </Space> : 
            buttons.map(button => <StyledButton key={button.id} onClick={button.onClick} active={button.active}>{button.name}</StyledButton>)
        }
    </StyledActionSelectorContainer>
    );
};

export default ActionSelector;