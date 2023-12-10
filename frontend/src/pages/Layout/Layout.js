import './Layout.css';
import { Outlet, Link } from "react-router-dom"
import { AppBar, Toolbar, Typography } from '@mui/material';
import React from "react";

function Layout() {
    return (
        <>
            <AppBar sx={{ background: 'transparent', boxShadow: 'none', backdropFilter: 'blur(5px)' }} position="absolute">
                <Toolbar>
                    <Typography sx={{ marginRight: '500px' }}  variant="h4">
                        SmartSports
                    </Typography>
                    <div className='link-container'>
                        <Link to="/" className='nav-link'>HOME</Link>
                        <Link to="about" className='nav-link'>ABOUT</Link>
                        <Link to="contract" className='nav-link'>CREATE CONTRACT</Link>
                    </div>
                        
                </Toolbar>
            </AppBar>

            <Outlet />
        </>
        
    );
}

export default Layout;