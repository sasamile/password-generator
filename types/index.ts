import { Element } from "@prisma/client";

export type formDataProps = {
  password: string;
  username?: string | undefined;
  isFavorite: boolean;
  name?: string | undefined;
  numberCard?: string | undefined;
  urlWebsite?: string | undefined;
  notes?: string | undefined;
};

export type FormeditElementProps = {
  dataElement: Element;
};

export type UploadFileResponse =
  | { data: UploadData; error: null }
  | { data: null; error: UploadError };

export type UploadData = {
  key: string;
  url: string;
  name: string;
  size: number;
};

export type UploadError = {
  code: string;
  message: string;
  data?: any;
};
