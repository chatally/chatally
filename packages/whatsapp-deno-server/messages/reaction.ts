export interface Reaction {
  /** The ID of the message the customer reacted to. */
  message_id: string;
  /** The emoji the customer reacted with. */
  emoji: string;
}

export interface ReactionMessage {
  type: "reaction";
  reaction: Reaction;
}
