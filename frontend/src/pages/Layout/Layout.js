import './Layout.css';
import { Outlet, Link } from "react-router-dom"
import { AppBar, Toolbar, Typography } from '@mui/material';

function Layout() {
    return (
        <>
            {/* <<Navbar fixed="top" className='navbar'>
                <Navbar.Brand as={Link} to="/" className='navbar-item'>
                    SmartSports
                </Navbar.Brand>
                <Navbar.Collapse>
                    <Nav>   
                        <Nav.Link as={Link} to="/" className='navbar-item'>
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/about" className='navbar-item'>
                            About
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>>  */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h4">
                        SmartSports
                    </Typography>
                        <Link to="/" className='nav-link'>Home</Link>
                        <Link to="/about" className='nav-link'>About</Link>
                        <Link to="/login" className='nav-link'>Login</Link>
                </Toolbar>
            </AppBar>

            <Outlet />
        </>
        
    );
}

export default Layout;