import moment from "moment";

export const formatDate = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 1000 * 60) return "now"; // If less than a minute then return "now"
    if (diff < 1000 * 60 * 60) return `${Math.round(diff / (1000 * 60))}mins ago`; // If less than an hour then return the number of minutes
    if (diff < 1000 * 60 * 60 * 24) return moment(date).format("h:mm A"); // If less than a day then return the number of hours
    return moment(date).format("DD/MM/YY"); // Otherwise return the date
}

export const wrapEmojisInHtmlTag = (messageText) => {
    const regexEmoji = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu; // regex to match all Unicode emojis
    return messageText.replace(regexEmoji, (match) => {
        return `<span style="font-size:1.5em;margin:0 2px;position:relative;top:2px">${match}</span>`;
    });
}; // Wrap emojis in a span tag with some styling