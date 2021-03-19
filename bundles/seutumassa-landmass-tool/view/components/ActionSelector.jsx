import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'antd';

const StyledActionSelectorContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 400px;
`;

const StyledButton = styled(Button)`
    min-width: 250px;
    height: 50px;
    margin: 10px;
`;

const ActionSelector = ({
    handleSelectGeometry,
    handleDrawNewGeometry,
    handleDownloadShapeFile
}) => {
    return (
    <StyledActionSelectorContainer>
        <StyledButton onClick={() => handleSelectGeometry()}>Valitse alue</StyledButton>
        <StyledButton onClick={() => handleDrawNewGeometry()}>Piirrä alue</StyledButton>
        <StyledButton onClick={() => handleDownloadShapeFile()}>Lataa shapefile</StyledButton>
    </StyledActionSelectorContainer>
    );
};

export default ActionSelector;