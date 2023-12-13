export type UserCreateRequest = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
};

export type UserLoginRequest = {
    username: string;
    password: string;
};

export type UserLoginResponse = {
    token: string;
};

export type UserGetResponse = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  subscriptionPlanId: number;
  timeUnitlSubscriptionExpires: {
    ticks: number;
    days: number;
    hours: number;
    milliseconds: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalHours: number;
    totalMilliseconds: number;
    totalMinutes: number;
    totalSeconds: number;
  };
};