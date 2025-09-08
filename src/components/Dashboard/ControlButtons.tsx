import { Button, Card, CardContent } from '@mui/material';
   import { PlayArrow, Stop, Refresh } from '@mui/icons-material';
   import { useMqtt } from '../../hooks/MqttProvider';
  //  import axios from 'axios';

   const ControlButtons = () => {
     // Modified: Use sendMessage from useMqtt instead of axios to send commands directly via MQTT
     const { deviceId, sendMessage } = useMqtt(); // Changed to include sendMessage

     // Removed: sendCommand async function, as we now use direct MQTT publish
     // const sendCommand = async (command: string) => {
     //   try {
     //     await axios.post('http://localhost:8080/api/send', command, {
     //       headers: { 'Content-Type': 'text/plain' },
     //     });
     //   } catch (error) {
     //     console.error('Error sending command:', error);
     //   }
     // };

     return (
       <Card sx={{ mb: 2 }}>
         <CardContent>
           <Button
             variant="contained"
             color="success"
             startIcon={<PlayArrow />}
             onClick={() => sendMessage('{START}')} // Changed to use sendMessage
             disabled={!deviceId}
             sx={{ mr: 1 }}
           >
             Start
           </Button>
           <Button
             variant="contained"
             color="error"
             startIcon={<Stop />}
             onClick={() => sendMessage('{STOP}')} // Changed to use sendMessage
             disabled={!deviceId}
             sx={{ mr: 1 }}
           >
             Stop
           </Button>
           <Button
             variant="contained"
             startIcon={<Refresh />}
             onClick={() => sendMessage('{RESET}')} // Changed to use sendMessage
             disabled={!deviceId}
           >
             Reset
           </Button>
         </CardContent>
       </Card>
     );
   };

   export default ControlButtons;
