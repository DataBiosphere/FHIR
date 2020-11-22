import React from 'react';
import styled from 'styled-components';

const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: thin solid #888;
  box-shadow: 1px 1px 1px grey;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    color: blue;
  }
`;

const Launch = styled.a`
  text-decoration: none;
  font-size: 1.5em;
  padding: 3px;
  display: inline-block;
  vertical-align: middle;
  padding-left: 42px;
  padding-right: 42px;
  font-size: 14px;
  font-weight: bold;
  /* Use the Roboto font that is loaded in the <head> */
  font-family: 'Roboto', sans-serif;
`;

function Navbar() {
  return (
    <Bar>
      <h2>Broad FHIR Viewer</h2>
      <Center>
        <Launch href="launch.html?iss=http%3A%2F%2F34.75.179.65%2F4_0_0%2F&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=openid%20profile">
          SMART launch
        </Launch>
      </Center>
    </Bar>
  );
}

export default Navbar;
