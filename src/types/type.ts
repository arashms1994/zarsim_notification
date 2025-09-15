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
