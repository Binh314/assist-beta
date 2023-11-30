import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface ChallengeDoc extends BaseDoc {
  name: string;
  description: string;
  goal: number;
  endTime: Date;
  completedBy: ObjectId[];
  reward: ObjectId;
}

export default class ChallengeConcept {
  public readonly challenges = new DocCollection<ChallengeDoc>("challenges");

  async create(name: string, description: string, goal: number, endTime: Date, reward: ObjectId) {
    const _id = await this.challenges.createOne({ name, description, goal, endTime, reward });
    return { msg: "Challenge successfully created!", challenge: await this.challenges.readOne({ _id }) };
  }

  async getActiveChallenges() {
    const now = new Date();
    return await this.challenges.readMany({ endTime: { $gte: now } });
  }

  async getChallengeById(_id: ObjectId) {
    const challenge = await this.challenges.readOne({ _id });
    if (!challenge) {
      throw new NotFoundError(`Challenge ${_id} does not exist!`);
    }
    return challenge;
  }

  async completeChallenge(_id: ObjectId, user: ObjectId, progress: number) {
    const challenge = await this.challenges.readOne({ _id });
    if (!challenge) {
      throw new NotFoundError(`Challenge ${_id} does not exist!`);
    }
    const now = new Date();
    if (now <= challenge.endTime && progress >= challenge.goal) {
      await this.challenges.updateOneGeneral({ _id }, { $addToSet: { completedBy: user } });
    } else {
      return { msg: "Challenge requirements not met!" };
    }
    return { msg: "Challenge successfully completed!", reward: challenge.reward };
  }

  async getCompletedUsers(_id: ObjectId) {
    const challenge = await this.challenges.readOne({ _id });
    if (!challenge) {
      throw new NotFoundError(`Challenge ${_id} does not exist!`);
    }
    return challenge.completedBy;
  }
}
