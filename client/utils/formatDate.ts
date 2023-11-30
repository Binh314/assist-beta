import moment from "moment";
/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
export const formatDate = (date: Date): string => moment(date).format("MMMM Do YYYY, h:mm a");
export const formatDateShort = (date: Date): string => moment(date).format("MMM Do YYYY, h:mm A");
export const formatTaskDate = (date: Date): string => moment(date).format("MMMM Do YYYY, h:mm a");
export const formatTime = (date: Date): string => moment(date).format("h:mm a");
export const toDateString = (date: string): string => moment(date).utc().toDate().toString();
export const formatDatepick = (date: Date): string => moment(date).format("YYYY-MM-DD");
export const formatTimepick = (date: Date): string => moment(date).format("HH:mm");
