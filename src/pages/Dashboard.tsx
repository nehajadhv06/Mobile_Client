
   import { Container } from '@mui/material';
   import DeviceConnection from '../components/Dashboard/DeviceConnection';
   import ControlButtons from '../components/Dashboard/ControlButtons';
   import LiveParameters from '../components/Dashboard/LiveParameters';
   import LiveFaults from '../components/Dashboard/LiveFaults';

   const Dashboard = () => {
     return (
       <Container sx={{ mt: 4 }}>
         <DeviceConnection />
         <ControlButtons />
         <LiveParameters />
         <LiveFaults />
       </Container>
     );
   };

   export default Dashboard;
