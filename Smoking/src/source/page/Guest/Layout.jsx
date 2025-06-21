import React from 'react';
import { Outlet } from 'react-router';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding-top: 72px;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex: 1;
`;

const MainContent = styled.main`
    flex: 1;
    background: #f0f2f5;
    min-height: 100vh;
    padding: 32px;
`;

const Layout = () => {
    return (
        <LayoutContainer>
            <Header />
            <ContentWrapper>
                <div style={{ position: 'fixed', top: 72, left: 0, height: 'calc(100vh - 72px)', width: 240, zIndex: 1000 }}>
                    <Sidebar />
                </div>
                <MainContent style={{ marginLeft: 240 }}>
                    <Outlet />
                </MainContent>
            </ContentWrapper>
        </LayoutContainer>
    );
};

export default Layout; 