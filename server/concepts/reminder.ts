import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ReminderDoc extends BaseDoc {
  recipient: ObjectId;
  message: string;
  frequency: number | null; // null if the reminder only occurs once
  lastRemind: Date | null; // null if the recipient has not seen the reminder
  type: string | null;
  contentId: ObjectId | null;
}

export default class ReminderConcept {
  public readonly reminders = new DocCollection<ReminderDoc>("reminders");

  /**
   *
   * @param recipient id of person to remind
   * @param message remind message
   * @param frequency frequency of reminders in hours. null if reminder only occurs once
   * @param type type of the reminder
   * @param contentId objectId of something related to the reminder
   */
  async create(recipient: ObjectId, message: string, type?: string, contentId?: ObjectId, frequency?: number) {
    const _id = await this.reminders.createOne({ recipient, message, frequency, type, contentId });
    return { msg: "Message successfully created", reminder: await this.reminders.readOne({ _id }) };
  }

  async getNewReminders(recipient: ObjectId, type?: string) {
    const query = type ? { recipient, type } : { recipient };
    const reminders = await this.reminders.readMany(query, {
      sort: { lastRemind: -1, dateCreated: -1 },
    });
    const newReminders = reminders.filter((reminder) => {
      if (!reminder.lastRemind) return true; // reminder has never been seen
      if (!reminder.frequency) return false; // reminder has been seen but only reminds once

      // add `frequency` hours to last remind time
      const lastRemindAndFrequency = this.addHours(reminder.lastRemind, reminder.frequency);

      if (new Date() >= lastRemindAndFrequency) return true;

      return false;
    });

    // sorting new reminders
    newReminders.sort((reminder1, reminder2) => {
      let date1 = reminder1.lastRemind;
      let date2 = reminder2.lastRemind;
      if (!date1) date1 = reminder1.dateCreated;
      else if (reminder1.frequency) date1 = new Date();

      if (!date2) date2 = reminder2.dateCreated;
      else if (reminder2.frequency) date2 = new Date();

      return date1.getTime() - date2.getTime();
    });

    // update remind times to current time
    for (const reminder of newReminders) {
      this.reminders.updateOne({ _id: reminder._id }, { lastRemind: new Date() });
    }

    return newReminders;
  }

  async getReminders(recipient: ObjectId, type?: string) {
    const query = type ? { recipient, type } : { recipient };
    const reminders = await this.reminders.readMany(query, {
      sort: { lastRemind: -1, dateCreated: -1 },
    });

    // sorting reminders
    reminders.sort((reminder1, reminder2) => {
      let date1 = reminder1.lastRemind;
      let date2 = reminder2.lastRemind;
      if (!date1) date1 = reminder1.dateCreated;
      else if (reminder1.lastRemind && reminder1.frequency && this.addHours(reminder1.lastRemind, reminder1.frequency) >= new Date()) date1 = new Date();

      if (!date2) date2 = reminder2.dateCreated;
      else if (reminder2.lastRemind && reminder2.frequency && this.addHours(reminder2.lastRemind, reminder2.frequency) >= new Date()) date2 = new Date();

      return date1.getTime() - date2.getTime();
    });

    // update remind times to current time
    for (const reminder of reminders) {
      this.reminders.updateOne({ _id: reminder._id }, { lastRemind: new Date() });
    }

    return reminders;
  }

  async deleteById(_id: ObjectId) {
    await this.reminders.deleteOne({ _id });
    return { msg: "Successfully deleted reminder." };
  }

  async deleteByContent(contentId: ObjectId) {
    await this.reminders.deleteMany({ contentId });
    return { msg: "Successfully deleted reminder(s)." };
  }

  async delete(query: Filter<ReminderDoc>) {
    await this.reminders.deleteMany(query);
    return { msg: "Successfully deleted reminder(s)." };
  }

  private addHours(date: Date, hours: number) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  }

  async isRecipient(recipient: ObjectId, _id: ObjectId) {
    const reminder = await this.reminders.readOne({ _id });
    if (!reminder) throw new NotFoundError("Reminder not found.");
    if (recipient.toString() !== reminder.recipient.toString()) throw new NotAllowedError("User is not recipient of reminder.");
  }
}
