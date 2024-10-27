import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '@mui/icons-material';
import { logoutAction } from '../redux/actions/authActions';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import secureLocalStorage from "react-secure-storage";
import { getReportDetailsAction } from '../redux/actions/reportActions';

function ResponsiveAppBar() {
  const masterReport = useSelector((state: any) => state.report?.masterReport);
  const accessCode = JSON.parse(secureLocalStorage.getItem("accessCode") as string);
  const dispatch = useDispatch();

  const handleMenuClick = async (reportName: any, popupClose: () => void) => {
    popupClose();
    const reportId = reportName.ReportId;
    await dispatch(getReportDetailsAction(accessCode, reportId));
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return (
    <AppBar position="static" sx={{
      backgroundColor: '#007B8F',
      padding: 0, 
    }}>
    <Toolbar
        sx={{
          minHeight: '40px',
          paddingLeft: 1,
          paddingRight: 1,
          '@media (min-width: 600px)': {
            minHeight: '50px', 
          },
        }}
      >
    
        <Box sx={{ display: 'flex', gap: 2 }}>
          {masterReport && masterReport.map((page: any) => (
            <PopupState variant="popover" popupId={`menu-popup-${page.ReportName}`} key={page.ReportName}>
              {(popupState) => (
                <React.Fragment>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'white',
                      cursor: 'pointer',
                      fontFamily: 'Arial', 
                      fontSize: '15px', 
                      fontWeight: 500,
                      px: 2,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                    {...bindTrigger(popupState)}
                  >
                    {page.ReportName}
                  </Typography>
                  <Menu {...bindMenu(popupState)}>
                    {page.ChildItems.map((item: any) => (
                      <MenuItem
                      key={item.ReportName}
                      onClick={() => handleMenuClick(item, popupState.close)}
                      sx={{
                        fontFamily: 'Arial', 
                        fontSize: '10px', 
                        fontWeight: 400,  
                        color: '#000', 
                      }}
                    >
                        {item.ReportName}
                      </MenuItem>
                    ))}
                  </Menu>
                </React.Fragment>
              )}
            </PopupState>
          ))}
        </Box>
        <Box
            sx={{
              ml: 'auto',
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'red',
              px: 3,
              py: 1,              
              marginRight: -3, 
            }}
        >
          <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold', mr: 1 }}>
            Neethi Medical Lab
          </Typography>
          <IconButton onClick={logout} sx={{ color: 'white' }}>
            <Logout />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default ResponsiveAppBar;
