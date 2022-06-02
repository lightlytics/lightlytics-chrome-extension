export type DOMMessage = {
  type: "GET_DOM";
};

export type DOMMessageResponse = {
  resourceIds: string[];
  awsAccountId: string | undefined;
};
