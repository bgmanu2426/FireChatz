import moment from "moment";

export const formatDate = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 1000 * 60) return "now"; // If less than a minute then return "now"
    if (diff < 1000 * 60 * 60) return `${Math.round(diff / (1000 * 60))}mins ago`; // If less than an hour then return the number of minutes
    if (diff < 1000 * 60 * 60 * 24) return moment(date).format("h:mm A"); // If less than a day then return the number of hours
    return moment(date).format("DD/MM/YY"); // Otherwise return the date
}