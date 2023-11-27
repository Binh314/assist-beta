import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface TimeInterval {
  start: Date;
  end: Date;
}

export interface TaskDoc extends BaseDoc {
  requester: ObjectId;
  title: string;
  description: string;
  availability: TimeInterval[]; // array of json objects. json has `start` and `end` dates
  files: string[];
  assisters: ObjectId[];
  viewed: ObjectId[];
  completed: boolean;
}

export default class TaskConcept {
  public readonly tasks = new DocCollection<TaskDoc>("Tasks");

  async create(requester: ObjectId, title: string, description: string, availability: TimeInterval[], files: string[] = []) {
    const _id = await this.tasks.createOne({
      requester,
      title,
      description,
      availability,
      files,
      assisters: [],
      viewed: [],
      completed: false,
    });
    return { msg: "Task successfully created!", id: _id, task: await this.tasks.readOne({ _id }) };
  }

  async getTasks(query: Filter<TaskDoc>) {
    const tasks = await this.tasks.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return tasks;
  }

  async getTasksByRequester(requester: ObjectId) {
    return await this.getTasks({ requester, completed: false });
  }

  async update(_id: ObjectId, update: Partial<TaskDoc>) {
    this.sanitizeUpdate(update);
    await this.tasks.updateOne({ _id }, update);
    return { msg: "Task successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.tasks.deleteOne({ _id });
    return { msg: "Task deleted successfully!" };
  }

  /**
   * Assister offers to help with task.
   *
   * @param assister id of assister
   * @param _id id of task
   */
  async offerHelp(assister: ObjectId, _id: ObjectId) {
    await this.isNotRequester(assister, _id);
    await this.isNotAssister(assister, _id);

    const task = await this.tasks.readOne({ _id });
    if (!task) throw new NotFoundError(`Task ${_id} does not exist!`);

    const assisters = task.assisters;
    assisters.push(assister);
    this.tasks.updateOne({ _id }, { assisters: assisters });
    return { msg: "Successfully offered help." };
  }

  /**
   * Marks task as completed.
   *
   * @param _id id of task
   */
  async completeTask(_id: ObjectId) {
    const task = await this.tasks.readOne({ _id });
    if (!task) throw new NotFoundError(`Task ${_id} does not exist!`);
    await this.tasks.updateOne({ _id }, { completed: true });
    return { msg: "Successfully completed task." };
  }

  /**
   * Adds viewer to the viewed set.
   *
   * @param viewer id of viewer
   * @param _id id of task
   */
  async viewTask(viewer: ObjectId, _id: ObjectId) {
    const task = await this.tasks.readOne({ _id });
    if (!task) throw new NotFoundError(`Task ${_id} does not exist!`);

    const viewed = task.viewed;

    // if viewer has not viewed task yet
    if (!viewed.map((e) => e.toString()).includes(viewer.toString())) {
      viewed.push(viewer);
      await this.tasks.updateOne({ _id }, { viewed: viewed });
    }

    return { msg: "Successfully viewed task." };
  }

  async isRequester(requester: ObjectId, _id: ObjectId) {
    const task = await this.tasks.readOne({ _id });
    if (!task) {
      throw new NotFoundError(`Task ${_id} does not exist!`);
    }
    if (task.requester.toString() !== requester.toString()) {
      throw new TaskRequesterNotMatchError(requester, _id);
    }
  }

  async isNotRequester(requester: ObjectId, _id: ObjectId) {
    const task = await this.tasks.readOne({ _id });
    if (!task) {
      throw new NotFoundError(`Task ${_id} does not exist!`);
    }
    if (task.requester.toString() === requester.toString()) {
      throw new NotAllowedError("Person is the requester.");
    }
  }

  async isNotAssister(assister: ObjectId, _id: ObjectId) {
    const task = await this.tasks.readOne({ _id });
    if (!task) {
      throw new NotFoundError(`Task ${_id} does not exist!`);
    }
    const assisters = task.assisters.map((e) => e.toString());
    if (assisters.includes(assister.toString())) {
      throw new NotAllowedError("Person is already an assister.");
    }
  }

  private sanitizeUpdate(update: Partial<TaskDoc>) {
    // Make sure the update cannot change the host, interested people, or attendees
    const prohibitedUpdates = ["requester"];
    for (const key in update) {
      if (prohibitedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }
}

export class TaskRequesterNotMatchError extends NotAllowedError {
  constructor(
    public readonly requester: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the host of Task {1}!", requester, _id);
  }
}
