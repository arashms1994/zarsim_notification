export interface IFileUploaderProps {
  orderNumber: string | null;
  subFolder: string;
  docType?: string;
}

export interface ICashListItem {
  ID: number;
  Title: string;
  count: string;
  due_date: string;
  reference_number: string;
  status: string;
  customer_GUID: string;
  bank_account: string;
  customer_title: string;
  description: string;
}

export interface ITableUIProps {
  data: ICashListItem[] | undefined;
  backgroundColor?: string;
}

export interface IFileDownloadLinkProps {
  customerGuid: string;
  itemGuid: string;
}

export interface IAttachmentFile {
  fileName: string;
  fileUrl: string;
}

export interface IFile {
  Name: string;
  ServerRelativeUrl: string;
}

export interface INotification {
  ID: number;
  Title: string;
  dont_show: string;
  deadline: string;
  assign: string;
  from_list: string;
  item_id: string;
  massage: string;
  From_Date: string;
  Item_URL: string;
  Snooze: string;
}

export interface ISPPageContextInfo {
  userLoginName: string;
  userId: number;
  webAbsoluteUrl: string;
  webTitle: string;
  siteAbsoluteUrl: string;
  siteId: string;
  webId: string;
}
