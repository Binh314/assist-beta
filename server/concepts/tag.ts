import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface TagDoc extends BaseDoc {
  name: string;
  item: Array<ObjectId>;
}

export default class TagConcept {
  public readonly tags = new DocCollection<TagDoc>("tags");

  async create(i: ObjectId, n: string) {
    if (n.length > 20) {
      throw new NotAllowedError("Tag is too long. Maximum length is 20 characters.");
    }

    const exist = await this.tags.readOne({ name: n });

    if (exist) {
      const attachResponse = await this.attach(i, exist._id);
      return { msg: "Tag already exist", tag: attachResponse.tag };
    } else {
      const createdTag = await this.tags.createOne({ name: n, item: [i] });
      return { msg: "Tag successfully created", tag: createdTag };
    }
  }

  async attach(i: ObjectId, t: ObjectId) {
    const tag = await this.tags.readOne({ _id: t });

    if (!tag) {
      throw new NotFoundError("This tag does not exist");
    }

    // Check if the item is already attached to the tag
    if (!tag.item.includes(i)) {
      // Attach the item to the tag
      tag.item.push(i);

      // Save the updated tag
      const updatedTag = await this.tags.updateOne({ _id: t }, { item: tag.item });

      return { msg: "Item successfully attached to tag", tag: updatedTag };
    } else {
      return { msg: "Item is already attached to this tag", tag: tag };
    }
  }

  async detach(i: ObjectId, t: ObjectId) {
    const tag = await this.tags.readOne({ _id: t });

    if (!tag) {
      throw new NotFoundError("This tag does not exist");
    }

    const newItem = [];

    for (const currentItem of tag.item) {
      if (currentItem.toString() !== i.toString()) {
        newItem.push(currentItem);
      }
    }
    const updatedTag = await this.tags.updateOne({ _id: t }, { item: newItem });
    return { msg: "Item successfully detached from tag", tag: updatedTag };
  }

  async getTagByName(n: string) {
    const tag = await this.tags.readOne({ name: n });
    return tag;
  }

  async getTagById(id: ObjectId) {
    const tag = await this.tags.readOne({ _id: id });
    return tag;
  }

  /**
   *
   * Find all tag attach to itemId
   *
   * @param itemId ObjectID of the item
   * @returns list of Tag objects
   */
  async getTagsByItemId(itemId: ObjectId) {
    const tags = await this.tags.readMany({ item: { $elemMatch: { $eq: itemId } } });
    return tags;
  }
}
