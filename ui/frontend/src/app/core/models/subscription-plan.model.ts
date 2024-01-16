export type SubscriptionPlanCreateRequest = {
  title: string;
  price: number;
  subscriptionDurationDays: number;
};

export type SubscriptionPlanGetAllResponse = {
  id: number;
  title: string;
  price: number;
  subscriptionDurationDays: number;
};
