
   import { ThemeProvider, createTheme } from '@mui/material/styles';
   import CssBaseline from '@mui/material/CssBaseline';
   import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import NavBar from './components/NavBar';
   import Dashboard from './pages/Dashboard';
   import Settings from './pages/Settings';
   import History from './pages/History';
   import { MqttProvider } from './hooks/MqttProvider';

   const theme = createTheme({
     palette: {
       primary: { main: '#1976d2' },
       secondary: { main: '#dc004e' },
     },
   });

   const App = () => {
     return (
       <MqttProvider>
         <ThemeProvider theme={theme}>
           <CssBaseline />
           <Router>
             <NavBar />
             <Routes>
               <Route path="/" element={<Dashboard />} />
               <Route path="/settings" element={<Settings />} />
               <Route path="/history" element={<History />} />
             </Routes>
           </Router>
         </ThemeProvider>
       </MqttProvider>
     );
   };

   export default App;
   