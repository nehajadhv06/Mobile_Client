import mqtt from 'mqtt';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface MqttContextType {
  deviceId: string;
  setDeviceId: (id: string) => void;
  parameters: Record<string, string>;
  sendMessage: (message: string) => void;
  submitSetpoints: (setpoints: Record<string, string>) => void;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (!context) {
    throw new Error('useMqtt must be used within an MqttProvider');
  }
  return context;
};

export const MqttProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceId, setDeviceId] = useState<string>('');
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  useEffect(() => {
    const mqttClient = mqtt.connect('ws://localhost:9001');
    mqttClient.on('connect', () => {
      console.log('Frontend connected to MQTT broker');
      mqttClient.subscribe('proton/MPU/+/+', { qos: 0 }, (err) => {
        if (err) console.error('Frontend subscription error:', err);
        else console.log('Frontend subscribed to proton/MPU/+/+');
      });
    });

    mqttClient.on('message', (topic, message) => {
      console.log('Frontend received message on topic', topic, ':', message.toString());
      try {
        const messageStr = message.toString();
        if (messageStr.startsWith('{') && messageStr.endsWith('}')) {
          const content = messageStr.slice(1, -1);
          const pairs = content.split(',');
          const parsed: Record<string, string> = {};
          pairs.forEach(pair => {
            const [key, value] = pair.split(':');
            if (key && value) {
              parsed[key.trim()] = value.trim();
            }
          });
          if (parsed.PR) {
            setParameters((prev) => ({ ...prev, ...parsed }));
          }
        }
      } catch (error) {
        console.error('Error parsing MQTT message:', error);
      }
    });

    mqttClient.on('error', (error) => {
      console.error('Frontend MQTT error:', error);
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  const sendMessage = (message: string): void => {
    if (client && deviceId) {
      const cleanDeviceId = deviceId.replace(/^PR:/, '');
      client.publish(`proton/MPU/PR:${cleanDeviceId}/td`, message, { qos: 0 }, (err) => {
        if (err) console.error('Frontend publish error:', err);
        else console.log('Frontend published message:', message);
      });
    }
  };
  const submitSetpoints = (setpoints: Record<string, string>): void => {
    if (client && deviceId) {
      const cleanDeviceId = deviceId.replace(/^PR:/, '');
      const setpointObj = { ...setpoints, PR: cleanDeviceId };
      const message = '{' + Object.entries(setpointObj).map(([k, v]) => `${k}:${v}`).join(',') + '}';
      client.publish(`proton/MPU/PR:${cleanDeviceId}/td`, message, { qos: 0 }, (err) => {
        if (err) console.error('Frontend publish error:', err);
        else console.log('Frontend published setpoints:', message);
      });
    }
  };

  const contextValue: MqttContextType = {
    deviceId,
    setDeviceId,
    parameters,
    sendMessage,
    submitSetpoints,
  };

  return (
    <MqttContext.Provider value={contextValue}>
      {children}
    </MqttContext.Provider>
  );
};