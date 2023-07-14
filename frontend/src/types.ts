export type UploadedFile = {
  name: string;
  key: string;
  expire?: number;
};

export type TextContent = {
  value?: string;
  expire?: number;
};
