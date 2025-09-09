declare module "jalali-moment" {
  interface Moment {
    locale(locale: string): Moment;
    format(format: string): string;
    isValid(): boolean;
  }
  function moment(date: string, format?: string): Moment;
  export = moment;
}
