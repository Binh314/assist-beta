import { ObjectId } from "mongodb";

import { BadValuesError, NotAllowedError } from "./concepts/errors";
import { Router, getExpressRouter } from "./framework/router";

import schedule from "node-schedule";
import { Badge, Challenge, Friend, Kudo, Match, Message, Post, Reminder, Tag, Task, User, WebSession } from "./app";
import { ChallengeDoc } from "./concepts/challenge";
import { PostDoc, PostOptions } from "./concepts/post";
import { ReminderDoc } from "./concepts/reminder";
import { TaskDoc } from "./concepts/task";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

schedule.scheduleJob({ hour: 0, minute: 0, dayOfWeek: 0 }, function () {
  void resetChallenges(2, 2);
});

/**
 * Reset challenges for the week. Should be automatically called weekly.
 * @param helpGoal optional, default = 5. number of tasks users need to help with this week
 * @param taskGoal optional, default = 5. number of tasks users need to complete this week
 */
async function resetChallenges(helpGoal = 5, taskGoal = 5) {
  const challenges = [
    {
      name: "Help Friends!",
      description: `Help with ${helpGoal} tasks this week.`,
      goal: helpGoal,
      reward: new ObjectId("6567e30d37085155a767d595"),
    },
    {
      name: "Complete Tasks!",
      description: `Complete ${taskGoal} tasks this week.`,
      goal: taskGoal,
      reward: new ObjectId("6567e42337085155a767d596"),
    },
  ];
  const now = new Date();
  const deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Add milliseconds for one week

  for (const challenge of challenges) {
    await Challenge.create(challenge.name, challenge.description, challenge.goal, deadline, challenge.reward);
  }
}

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.get("/users/id/:userID")
  async getUsername(userID: ObjectId) {
    return await User.getUserById(userID);
  }

  @Router.get("/users/matching/:prefix")
  async getUsersByPrefix(prefix: string) {
    return await User.getUsersByUsernameMatch(prefix);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string, picture: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password, picture);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);

    const tasks = await Task.getTasksByRequester(user);
    for (const task of tasks) {
      await Task.delete(task._id);
    }

    await Message.deleteMessages(user);

    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/auth")
  async auth(session: WebSessionDoc, username: string, password: string) {
    try {
      const u = await User.authenticate(username, password);
      if (!u) {
        return { authentication: false };
      }
      const user = WebSession.getUser(session);
      return { authentication: u._id.toString() === user.toString() };
    } catch (error) {
      // Log the error and return a false authentication
      console.error(error);
      return { authentication: false };
    }
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUsersByIds(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/incomingRequests")
  async getIncomingRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const requesters = (await Friend.getIncomingRequests(user)).map((request) => request.from);
    return await User.getUsersByIds(requesters);
  }

  /**
   *
   * @param session websession
   * @param other the user you want to check your friendship status with
   * @returns "friends" if you are friends, "sent" if you have a pending request to them,
   *          "received" if you have a pending request from them, "non" if no friendship or requests
   */
  @Router.get("/friend/status/:other")
  async getFriendStatus(session: WebSessionDoc, other: string) {
    const user = WebSession.getUser(session);
    const otherId = (await User.getUserByUsername(other))._id;
    return await Friend.getStatus(user, otherId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;

    const username = (await User.getUserById(user)).username;

    const result = await Friend.sendRequest(user, toId);

    // TODO: Modify Friend reminder to fit frontend implementation
    const requests = await Friend.getRequests(user);
    const id = requests.filter((request) => request.to.toString() === toId.toString())[0]._id;
    if (id) await Reminder.create(toId, `You have a friend request from ${username}!`, "friendRequest", id, 24);

    return result;
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;

    const requests = await Friend.getRequests(user);
    const id = requests.filter((request) => request.to.toString() === toId.toString())[0]._id;
    if (id) await Reminder.deleteByContent(id);

    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;

    const username = (await User.getUserById(user)).username;

    // TODO: Modify Reminder to work with frontend implementation
    await Reminder.create(fromId, `${username} accepted your friend request!`, "friendAccept", user);

    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }

  @Router.post("/tag")
  async createTag(session: WebSessionDoc, i: string, n: string) {
    const user = WebSession.getUser(session);
    const i_id = new ObjectId(i);
    return await Tag.create(i_id, n);
  }

  @Router.get("/tag/name/:tagName")
  async getTagByName(session: WebSessionDoc, tagName: string) {
    const user = WebSession.getUser(session);
    // Assuming Tag is a class or module with the getTagByName method
    return await Tag.getTagByName(tagName);
  }

  @Router.get("/tag/id/:tagId")
  async getTagById(session: WebSessionDoc, tagId: string) {
    const user = WebSession.getUser(session);
    const objectId = new ObjectId(tagId); // Convert string to ObjectId
    return await Tag.getTagById(objectId);
  }

  @Router.get("/tag/item/:itemId")
  async getTagsByItem(session: WebSessionDoc, itemId: string) {
    const user = WebSession.getUser(session);
    const objectId = new ObjectId(itemId); // Convert string to ObjectId
    return await Tag.getTagsByItemId(objectId);
  }

  @Router.get("/tag/user/:username")
  async getTagsByUser(session: WebSessionDoc, username: string) {
    const user = WebSession.getUser(session);
    const userId = (await User.getUserByUsername(username))._id;
    return await Tag.getTagsByItemId(userId);
  }

  @Router.patch("/tag/attach")
  async attachItemToTag(session: WebSessionDoc, tagId: string, itemId: string) {
    const user = WebSession.getUser(session);
    const tagObjectId = new ObjectId(tagId); // Convert string to ObjectId for the tag
    const itemObjectId = new ObjectId(itemId); // Convert string to ObjectId for the item

    return await Tag.attach(itemObjectId, tagObjectId);
  }

  @Router.patch("/tag/detach")
  async detachItemToTag(session: WebSessionDoc, tagId: string, itemId: string) {
    const user = WebSession.getUser(session);
    const tagObjectId = new ObjectId(tagId); // Convert string to ObjectId for the tag
    const itemObjectId = new ObjectId(itemId); // Convert string to ObjectId for the item

    return await Tag.detach(itemObjectId, tagObjectId);
  }

  // Message

  @Router.post("/message/:otherUser")
  async sendMessage(session: WebSessionDoc, otherUser: string, text: string, files?: string) {
    const sender = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(otherUser))._id;
    const filesArray = files
      ? files
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e)
      : [];
    return await Message.send(sender, toId, text, filesArray);
  }

  @Router.get("/message/user/:otherUser")
  async getMessages(session: WebSessionDoc, otherUser: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(otherUser))._id;
    return Responses.messages(await Message.getConversation(user, toId));
  }

  @Router.post("/kudo")
  async sendKudo(session: WebSessionDoc, receiver: string, task: string, message: string) {
    const giver = WebSession.getUser(session);
    const receiverId = new ObjectId(receiver);
    const taskId = new ObjectId(task);
    return await Kudo.giveKudos(giver, receiverId, taskId, message);
  }

  @Router.get("/kudo/task/:task")
  async getKudoForTask(session: WebSessionDoc, task: string) {
    const user = WebSession.getUser(session);
    const taskId = new ObjectId(task);

    return await Kudo.getKudoForTask(taskId);
  }

  @Router.get("/kudo/received/:receiver")
  async getReceivedKudosOfUser(session: WebSessionDoc, receiver: string) {
    const user = WebSession.getUser(session);
    const receiverId = new ObjectId(receiver);

    return await Kudo.getReceivedKudosOfUser(receiverId);
  }

  @Router.get("/kudo/given/:giver")
  async getGivenKudosOfUser(session: WebSessionDoc, giver: string) {
    const user = WebSession.getUser(session);
    const giverId = new ObjectId(giver);

    return await Kudo.getGivenKudosOfUser(giverId);
  }

  @Router.get("/kudo/givenCount/:giver")
  async getGivenKudosCount(session: WebSessionDoc, giver: string) {
    const user = WebSession.getUser(session);
    const giverId = new ObjectId(giver);

    return await Kudo.getGivenKudosCount(giverId);
  }

  @Router.get("/kudo/receivedCount/:receiver")
  async getReceivedKudosCount(session: WebSessionDoc, receiver: string) {
    const receiverId = new ObjectId(receiver);

    return await Kudo.getReceivedKudosCount(receiverId);
  }

  @Router.get("/message/all")
  async getAllMessages(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return Responses.messages(await Message.getMessages({ $or: [{ from: user }, { to: user }] }));
  }

  // Task

  // @Router.get("/tasks")
  // async getTasks(requester?: string) {
  //   let tasks;
  //   if (requester) {
  //     const id = (await User.getUserByUsername(requester))._id;
  //     tasks = await Task.getTasksByRequester(id);
  //   } else {
  //     tasks = await Task.getTasks({ completed: false });
  //   }
  //   return Responses.tasks(tasks);
  // }

  @Router.get("/tasks/matched")
  async getMatchedTasks(session: WebSessionDoc) {
    const user = await WebSession.getUser(session);
    const userTags = (await Tag.getTagsByItemId(user)).map((tag) => tag.name);

    const friends = await Friend.getFriends(user);

    // other user's tasks that have not passed deadline and is not completed
    const tasks = await Task.getTasks({ requester: { $ne: user, $in: friends }, deadline: { $gte: new Date() }, completed: false });

    const matchedTasksHelped: TaskDoc[] = [];
    const matchedTasks: TaskDoc[] = [];
    const unmatchedTasks: TaskDoc[] = [];

    const matchMap: Map<string, boolean> = new Map();

    // matching
    for (const task of tasks) {
      const taskTags = (await Tag.getTagsByItemId(task._id)).map((tag) => tag.name);
      const similarityScores = await Promise.all(await Match.getSimilarities(userTags, taskTags));
      if (similarityScores.filter((e) => e > 50).length > 0) {
        const offeredHelp = task.assisters.filter((a) => a.toString() === user.toString()).length > 0;

        if (offeredHelp) matchedTasksHelped.push(task);
        else matchedTasks.push(task);

        matchMap.set(task._id.toString(), true);
      } else {
        unmatchedTasks.push(task);
        matchMap.set(task._id.toString(), false);
      }
    }

    const allTasks = matchedTasks.concat(...unmatchedTasks, ...matchedTasksHelped);

    const isMatched: boolean[] = allTasks.map((task) => {
      const matched = matchMap.get(task._id.toString());
      return matched ? matched : false;
    });

    return Responses.tasks(allTasks, isMatched);
  }

  /**
   *
   * @param session
   * @returns tasks that the user has requested that have been completed
   */
  @Router.get("/tasks/completed")
  async getCompletedTasks(session: WebSessionDoc) {
    const requester = WebSession.getUser(session);
    const tasks = await Task.getTasks({ requester: requester, completed: true });
    return Responses.tasks(tasks);
  }

  /**
   *
   * @param session
   * @returns tasks that the user has requested that have not been completed
   */
  @Router.get("/tasks/requested")
  async getRequestedTasks(session: WebSessionDoc) {
    const requester = WebSession.getUser(session);
    const tasks = await Task.getTasksByRequester(requester);
    return Responses.tasks(tasks);
  }

  /**
   *
   * @param id id of task
   * @returns task
   */
  @Router.get("/tasks/id/:id")
  async getTask(id: string) {
    const _id = new ObjectId(id);
    return Responses.task(await Task.getTaskById(_id));
  }

  /**
   *
   * @param availability array of json formatted as {start: `date string`, end: `date string`}
   */
  @Router.post("/tasks")
  async createTask(session: WebSessionDoc, title: string, description: string, deadline: string, tags: string[], files?: string[]) {
    const user = WebSession.getUser(session);

    const deadlineTimestamp = Date.parse(deadline);
    if (!deadlineTimestamp) throw new BadValuesError("Could Not Parse Start Time");
    const dl = new Date(deadlineTimestamp);

    const created = await Task.create(user, title, description, dl, files);

    // attach tags
    if (created.task) {
      for (const tag of tags) Tag.create(created.task._id, tag);

      const friends = await Friend.getFriends(user);
      for (const friend of friends) {
        const username = (await User.getUserById(user)).username;
        await Reminder.create(friend, `Help Request from ${username} on ${created.task.title}!`, "taskRequest", created.task._id);
      }
    }

    return { msg: created.msg, task: await Responses.task(created.task) };
  }
  /**
   *
   * @param availability array of json formatted as {start: `date string`, end: `date string`}
   */
  @Router.patch("/tasks/:_id/edit")
  async editTask(session: WebSessionDoc, _id: string, title: string, description: string, deadline: string, files?: string[]) {
    const user = WebSession.getUser(session);
    const id = new ObjectId(_id.toString());

    const deadlineTimestamp = Date.parse(deadline);
    if (!deadlineTimestamp) throw new BadValuesError("Could Not Parse Start Time");
    const dl = new Date(deadlineTimestamp);

    return await Task.update(id, { title, description, deadline: dl, files });
  }

  @Router.delete("/tasks/:_id")
  async deleteTask(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Task.isRequester(user, _id);

    await Reminder.deleteByContent(new ObjectId(_id.toString()));

    return await Task.delete(_id);
  }

  /**
   *
   * @param _id id of task
   * @param assister username of assister who completed the task
   */
  @Router.patch("/tasks/:_id/complete")
  async completeTask(session: WebSessionDoc, _id: ObjectId, assister: string) {
    const user = WebSession.getUser(session);
    await Task.isRequester(user, _id);

    // requester resolved the task without any help
    if (!assister) {
      const result = await Task.complete(_id);

      // check "complete tasks" challenge
      const challenges = await Challenge.getActiveChallenges();
      for (const challenge of challenges) {
        if (challenge.name === "Complete Tasks!" && !(await Challenge.hasCompleted(challenge._id, user))) {
          const progress = await getChallengeProgressHelper(user, challenge);
          const result = await Challenge.completeChallenge(challenge._id, user, progress);
          if (result.reward) {
            await Badge.awardBadge(result.reward, user);
          }
        }
      }

      return result;
    }

    const userId = (await User.getUserByUsername(assister))._id;
    const result = await Task.complete(_id, userId);

    // TODO: Modify Kudos Reminder to fit implementation of kudos frontend
    await Reminder.create(user, `Don't forget to give a kudos to ${assister}!`, "kudos", userId);

    // Check if completing this task completes any new challenges, and award badges if needed
    const challenges = await Challenge.getActiveChallenges();
    for (const challenge of challenges) {
      if (challenge.name === "Complete Tasks!" && !(await Challenge.hasCompleted(challenge._id, user))) {
        const progress = await getChallengeProgressHelper(user, challenge);
        const result = await Challenge.completeChallenge(challenge._id, user, progress);
        if (result.reward) {
          await Badge.awardBadge(result.reward, user);
        }
      } else if (challenge.name === "Help Friends!" && !(await Challenge.hasCompleted(challenge._id, userId))) {
        const progress = await getChallengeProgressHelper(userId, challenge);
        const result = await Challenge.completeChallenge(challenge._id, userId, progress);
        if (result.reward) {
          await Badge.awardBadge(result.reward, userId);
        }
      }
    }

    return result;
  }

  @Router.patch("/tasks/:_id/help/offer")
  async offerTaskHelp(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);

    const task = await Task.getTaskById(_id);
    const username = (await User.getUserById(user)).username;

    await Reminder.create(task.requester, `Help offer from ${username} on ${task.title}!`, "taskOffer", user);
    return await Task.offerHelp(user, _id);
  }

  @Router.patch("/tasks/:_id/help/retract")
  async retractTaskHelp(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);

    Reminder.delete({ contentId: user, type: "taskOffer" });

    return await Task.retractHelp(user, _id);
  }

  @Router.patch("/tasks/:_id/view")
  async viewTask(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Task.view(user, _id);
  }

  @Router.get("/challenges")
  async getChallenges() {
    return await Challenge.getActiveChallenges();
  }

  /**
   * @param session websession
   * @param _id challenge id
   * @returns the user's progress on challenge _id as number of tasks completed or helped with this week
   */
  @Router.get("/challenges/:_id/progress")
  async getChallengeProgress(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    const challenge = await Challenge.getChallengeById(_id);
    return await getChallengeProgressHelper(user, challenge);
  }

  /**
   * @param user username of the user
   * @returns array of badges with the count of each badge for the specified user
   */
  @Router.get("/badges/:username")
  async getBadgeCount(username: string) {
    const user = (await User.getUserByUsername(username))._id;
    const badges = await Badge.getBadges();
    const badgesWithCount = [];
    for (const badge of badges) {
      const count = await Badge.getBadgeCount(badge._id, user);
      badgesWithCount.push({ ...badge, count: count });
    }
    return badgesWithCount;
  }

  // Reminders

  @Router.get("/reminders/new/:type")
  async getNewReminders(session: WebSessionDoc, type?: string) {
    const user = await WebSession.getUser(session);
    const reminders: ReminderDoc[] = await Reminder.getNewReminders(user, type);
    return reminders;
  }

  @Router.get("/reminders/all/:type")
  async getReminders(session: WebSessionDoc, type?: string) {
    const user = await WebSession.getUser(session);
    const reminders = await Reminder.getReminders(user, type);
    return reminders;
  }

  @Router.delete("/reminders/:id")
  async deleteReminder(session: WebSessionDoc, id: string) {
    const user = WebSession.getUser(session);
    await Reminder.isRecipient(user, new ObjectId(id));
    return await Reminder.deleteById(new ObjectId(id));
  }
}

async function getChallengeProgressHelper(user: ObjectId, challenge: ChallengeDoc) {
  const endTime = challenge.endTime;
  const startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (challenge.name === "Complete Tasks!") {
    const completedTasks = await Task.getTasks({ requester: user, completionDate: { $gt: startTime, $lte: endTime } });
    return completedTasks.length;
  } else if (challenge.name === "Help Friends!") {
    const helpedTasks = await Task.getTasks({ completer: user, completionDate: { $gt: startTime, $lte: endTime } });
    return helpedTasks.length;
  } else {
    throw new NotAllowedError("Unknown challenge.");
  }
}

export default getExpressRouter(new Routes());
