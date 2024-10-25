import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '@mui/icons-material';
import { logoutAction } from '../redux/actions/authActions';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

function ResponsiveAppBar() {
  const masterReport = useSelector((state:any) => state.report?.masterReport);
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const logout = () => {
    dispatch(logoutAction())
  };

  return (
    <AppBar position="static" color='transparent'>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'blue',
              textDecoration: 'none',
            }}
          >
            PROMEDIS REPORTS
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {masterReport && masterReport.map((page:any) => (
                <MenuItem key={page.ReportName} onClick={handleCloseNavMenu}>
                  {/* <Typography sx={{ textAlign: 'center' }}>{page.ReportName}<KeyboardArrowDown/></Typography> */}
                  <PopupState variant="popover" popupId="demo-popup-menu">
                  {(popupState:any) => (
                    <React.Fragment>
                      <Button variant="contained" {...bindTrigger(popupState)}>
                         {page.ReportName}
                      </Button>
                      <Menu {...bindMenu(popupState)}>
                        {page.ChildItems.map((item:any)=>
                            <MenuItem onClick={popupState.close} key={item.ReportName}>{item.ReportName}
                            </MenuItem>
                        )}
                      </Menu>
                    </React.Fragment>
                  )}
                </PopupState>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'blue',
              textDecoration: 'none',
            }}
          >
            PROMEDIS REPORTS
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {masterReport && masterReport.map((page:any) => (
              <MenuItem key={page.ReportName} onClick={handleCloseNavMenu}>
              <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState:any) => (
                <React.Fragment>
                  <Button variant="contained" {...bindTrigger(popupState)}>
                     {page.ReportName}
                  </Button>
                  <Menu {...bindMenu(popupState)}>
                    {page.ChildItems.map((item:any)=>
                        <MenuItem onClick={popupState.close} key={item.ReportName}>{item.ReportName}
                        </MenuItem>
                    )}
                  </Menu>
                </React.Fragment>
              )}
            </PopupState>
            </MenuItem>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Logout">
              <IconButton onClick={logout} sx={{ p: 0 }}>
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
