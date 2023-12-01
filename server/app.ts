import BadgeConcept from "./concepts/badge";
import ChallengeConcept from "./concepts/challenge";
import FriendConcept from "./concepts/friend";
import KudoConcept from "./concepts/kudos";
import MatchConcept from "./concepts/match";
import MessageConcept from "./concepts/message";
import PostConcept from "./concepts/post";
import TagConcept from "./concepts/tag";
import TaskConcept from "./concepts/task";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const Tag = new TagConcept();
export const Kudo = new KudoConcept();
export const Message = new MessageConcept();
export const Task = new TaskConcept();
export const Challenge = new ChallengeConcept();
export const Badge = new BadgeConcept();
export const Match = new MatchConcept();
