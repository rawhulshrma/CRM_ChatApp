import React from 'react';
import styled from 'styled-components';

const StyledBadge = styled.span`
  background-color: ${props => props.color};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

const Badge = ({ color, text }) => {
  return (
    <StyledBadge color={color}>
      {text}
    </StyledBadge>
  );
};

export default Badge;