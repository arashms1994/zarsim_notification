import moment from "jalali-moment";

export const formatToJalali = (dateStr: string): string => {
  try {
    const date = moment(dateStr, "MM/DD/YYYY");
    if (!date.isValid()) {
      return "تاریخ نامعتبر";
    }
    return date.locale("fa").format("YYYY/MM/DD");
  } catch (error) {
    console.error("خطا در تبدیل تاریخ:", error);
    return "تاریخ نامعتبر";
  }
};
