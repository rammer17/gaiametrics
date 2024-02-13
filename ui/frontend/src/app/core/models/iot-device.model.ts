export type IoTDeviceCreateRequest = {
  name: string;
  latitude: number;
  longtitude: number;
  deviceGroupId: number;
};

export type IoTDeviceGetResponse = {
  id: number;
  name: string;
  latitude: number;
  longtitude: number;
};
