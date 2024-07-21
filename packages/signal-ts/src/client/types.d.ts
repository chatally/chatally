export type CallbackResultType = {
  successfulServiceIds?: Array<ServiceIdString>;
  failoverServiceIds?: Array<ServiceIdString>;
  errors?: Array<CustomError>;
  unidentifiedDeliveries?: Array<ServiceIdString>;
  dataMessage: Uint8Array | undefined;
  editMessage: Uint8Array | undefined;

  // If this send is not the final step in a multi-step send, we shouldn't treat its
  //   results we would treat a one-step send.
  sendIsNotFinal?: boolean;

  // Fields necessary for send log save
  contentHint?: number;
  contentProto?: Uint8Array;
  timestamp?: number;
  recipients?: Record<ServiceIdString, Array<number>>;
  urgent?: boolean;
  hasPniSignatureMessage?: boolean;
};

export type WebAPICredentials = {
  username: string;
  password: string;
};

export type KeyPairType = {
  privKey: Uint8Array;
  pubKey: Uint8Array;
};

export type UploadPreKeyType = {
  keyId: number;
  publicKey: Uint8Array;
};

export type CompatSignedPreKeyType = {
  keyId: number;
  keyPair: KeyPairType;
  signature: Uint8Array;
};

export type CompatPreKeyType = {
  keyId: number;
  keyPair: KeyPairType;
};
