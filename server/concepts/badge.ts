import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface BadgeDoc extends BaseDoc {
  name: string;
  description: string;
  icon: string;
  awardedTo: AwardedDoc[];
}

export interface AwardedDoc extends BaseDoc {
  user: ObjectId;
  count: number; // indicates how many of a badge the user has
}

export default class BadgeConcept {
  public readonly badges = new DocCollection<BadgeDoc>("badges");

  async create(name: string, description: string, icon: string) {
    const _id = await this.badges.createOne({ name, description, icon });
    return { msg: "Badge successfully created!", badge: await this.badges.readOne({ _id }) };
  }

  async getBadges() {
    return await this.badges.readMany({});
  }

  /**
   * increment the user's count of their number of badges of badge _id
   *
   * @param _id badge id
   * @param user user id
   */
  async awardBadge(_id: ObjectId, user: ObjectId) {
    const badge = await this.badges.readOne({ _id });
    user = new ObjectId(user);
    if (!badge) {
      throw new NotFoundError(`Badge ${_id} does not exist!`);
    }
    const awardedToUser = badge.awardedTo.find((awarded) => awarded.user.equals(user));
    if (awardedToUser) {
      awardedToUser.count++;
    } else {
      const newAwardedDoc: AwardedDoc = {
        _id: new ObjectId(),
        dateCreated: new Date(),
        dateUpdated: new Date(),
        user,
        count: 1,
      };
      badge.awardedTo.push(newAwardedDoc);
    }
    await this.badges.updateOne({ _id }, badge);
    return { msg: "Badge successfully awarded!" };
  }

  /**
   * @param _id badge id
   * @param user user id
   * @returns number of _id badges the user has
   */
  async getBadgeCount(_id: ObjectId, user: ObjectId) {
    const badge = await this.badges.readOne({ _id });
    if (!badge) {
      throw new NotFoundError(`Badge ${_id} does not exist!`);
    }
    const awardedToUser = badge.awardedTo.find((awarded) => awarded.user.equals(user));
    if (awardedToUser) {
      return awardedToUser.count;
    } else {
      return 0;
    }
  }
}
