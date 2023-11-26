import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Friend, Message, Post, Tag, User, WebSession } from "./app";
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
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
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

  @Router.get("/message/all")
  async getAllMessages(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return Responses.messages(await Message.getMessages({ $or: [{ from: user }, { to: user }] }));
  }
}

export default getExpressRouter(new Routes());
