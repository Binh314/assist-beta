import { ObjectId } from "mongodb";

import { BadValuesError } from "./concepts/errors";
import { Router, getExpressRouter } from "./framework/router";

import { Friend, Kudo, Message, Post, Tag, Task, User, WebSession } from "./app";
import { PostDoc, PostOptions } from "./concepts/post";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

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
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
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
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
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
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
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
  async getTagsByUser(session: WebSessionDoc, username: string){
    const user = WebSession.getUser(session);
    const userId = (await User.getUserByUsername(username))._id;
    return await Tag.getTagsByItemId(userId)
  }

  @Router.patch("/tag/attach")
  async attachItemToTag(session: WebSessionDoc, tagId: string, itemId: string) {
    const user = WebSession.getUser(session);
    const tagObjectId = new ObjectId(tagId); // Convert string to ObjectId for the tag
    const itemObjectId = new ObjectId(itemId); // Convert string to ObjectId for the item

    return await Tag.attach(itemObjectId, tagObjectId);
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

  @Router.get("/kudo/received/:received")
  async getReceivedKudosOfUser(session: WebSessionDoc, receiver: string) {
    const user = WebSession.getUser(session);
    const receiverId = new ObjectId(receiver);

    return await Kudo.getReceivedKudosOfUser(receiverId);
  }

  @Router.get("/kudo/given/:given")
  async getGivenKudosOfUser(session: WebSessionDoc, giver: string) {
    const user = WebSession.getUser(session);
    const giverId = new ObjectId(giver);

    return await Kudo.getGivenKudosOfUser(giverId);
  }

  @Router.get("/kudo/givenCount/:given")
  async getGivenKudosCount(session: WebSessionDoc, giver: string) {
    const user = WebSession.getUser(session);
    const giverId = new ObjectId(giver);

    return await Kudo.getGivenKudosCount(giverId);
  }

  @Router.get("/kudo/receivedCount/:received")
  async getReceivedKudosCount(session: WebSessionDoc, receiver: string) {
    const user = WebSession.getUser(session);
    const receiverId = new ObjectId(receiver);

    return await Kudo.getReceivedKudosCount(receiverId);
  }

  @Router.get("/message/all")
  async getAllMessages(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return Responses.messages(await Message.getMessages({ $or: [{ from: user }, { to: user }] }));
  }

  // Task

  @Router.get("/tasks")
  async getTasks(requester?: string) {
    let tasks;
    if (requester) {
      const id = (await User.getUserByUsername(requester))._id;
      tasks = await Task.getTasksByRequester(id);
    } else {
      tasks = await Task.getTasks({ completed: false });
    }
    return Responses.tasks(tasks);
  }

  /**
   *
   * @param session
   * @returns tasks that the user has requested that have been completed
   */
  @Router.get("/tasks/completed")
  async getCompletedTasks(session: WebSessionDoc) {
    const requester = WebSession.getUser(session);
    const tasks = await Task.getTasks({ _id: requester });
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
    let tasks;
    if (id) {
      const _id = new ObjectId(id);
      tasks = await Task.getTasks({ _id });
    } else {
      tasks = await Task.getTasks({});
    }
    return Responses.tasks(tasks);
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
    if (created.task)
      for (const tag of tags) {
        Tag.create(created.task._id, tag);
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
    return await Task.delete(_id);
  }

  @Router.patch("tasks/:id/complete")
  async completeTask(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Task.isRequester(user, _id);
    return await Task.complete(_id);
  }

  @Router.patch("/tasks/:_id/help/offer")
  async offerTaskHelp(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Task.offerHelp(user, _id);
  }

  @Router.patch("/tasks/:_id/help/retract")
  async retractTaskHelp(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Task.retractHelp(user, _id);
  }

  @Router.patch("/tasks/:_id/view")
  async viewTask(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Task.view(user, _id);
  }
}

export default getExpressRouter(new Routes());
