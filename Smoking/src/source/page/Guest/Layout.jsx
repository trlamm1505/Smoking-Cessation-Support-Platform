import React from 'react';
import { Outlet } from 'react-router';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding-top: 83px;
`;

const MainContent = styled.main`
    flex: 1;
    background: #f0f2f5;
    display: flex;
    width: calc(100vw - 250px);
    min-height: 100vh;
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
                <div style={{ position: 'fixed', top: 72, left: 0, height: 'calc(100vh - 72px)', width: 250, zIndex: 1000 }}>
                    <Sidebar />
                </div>
                <MainContent style={{ marginLeft: 250 }}>
                    <Outlet />
                </MainContent>
            </ContentWrapper>
        </LayoutContainer>
    );
};

export default Layout; 