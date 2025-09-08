
   import { useState } from 'react';
   import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
   import { Home, Settings, History as HistoryIcon, Menu as MenuIcon } from '@mui/icons-material';
   import { NavLink } from 'react-router-dom';

   const NavBar = () => {
     const [open, setOpen] = useState(false);

     const toggleDrawer = () => {
       setOpen(!open);
     };

     return (
       <>
         <AppBar position="static">
           <Toolbar>
             <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
               <MenuIcon />
             </IconButton>
             <Typography variant="h6">Proton Mobile Pump Controller</Typography>
           </Toolbar>
         </AppBar>
         <Drawer anchor="left" open={open} onClose={toggleDrawer}>
           <List>
             <ListItem component={NavLink} to="/" onClick={toggleDrawer}>
               <ListItemIcon><Home /></ListItemIcon>
               <ListItemText primary="Dashboard" />
             </ListItem>
             <ListItem component={NavLink} to="/settings" onClick={toggleDrawer}>
               <ListItemIcon><Settings /></ListItemIcon>
               <ListItemText primary="Settings" />
             </ListItem>
             <ListItem component={NavLink} to="/history" onClick={toggleDrawer}>
               <ListItemIcon><HistoryIcon /></ListItemIcon>
               <ListItemText primary="History" />
             </ListItem>
           </List>
         </Drawer>
       </>
     );
   };

   export default NavBar;
   