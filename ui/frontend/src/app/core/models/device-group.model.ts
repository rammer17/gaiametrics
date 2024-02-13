import { IoTDeviceGetResponse } from './iot-device.model';

export type DeviceGroupCreateRequest = {
  name: string;
  deviceIds: number[];
  userIds: number[];
};

export type DeviceGroupUpdateRequest = {
  id: number;
  name: string;
  deviceIds: number[];
  userIds: number[];
};

export type DeviceGroupGetResponse = {
  id: number;
  name: string;
  devices: IoTDeviceGetResponse[];
};
