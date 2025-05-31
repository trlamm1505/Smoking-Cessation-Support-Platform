import React from 'react';
import { Outlet } from 'react-router';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const MainContent = styled.main`
    flex: 1;
    background: #f0f2f5;
    display: flex;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex: 1;
`;

const Layout = () => {
    return (
        <LayoutContainer>
            <Header />
            <ContentWrapper>
                <Sidebar />
                <MainContent>
                    <Outlet />
                </MainContent>
            </ContentWrapper>
        </LayoutContainer>
    );
};

export default Layout; 