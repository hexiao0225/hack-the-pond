export type Speaker = 'bot' | 'you' | 'tool' | 'system';

export interface ChatMessage {
  id: number;
  from: Speaker;
  text: string;
}

export type CharacterKind = 'dog' | 'axolotl' | 'lobster' | 'bear' | 'raccoon';

/** What a level's fake AI returns after reading one message from the player. */
export interface AgentReply<S> {
  replies: Array<{ from: Exclude<Speaker, 'you'>; text: string }>;
  state: S;
  solved?: boolean;
}

export interface Level<S = unknown> {
  id: string;
  topic: string;
  title: string;
  npc: { name: string; kind: CharacterKind; role: string };
  /** Plain-language explainer shown before the challenge. */
  explain: string[];
  /** Everyday comparison that makes the idea click. */
  analogy: string;
  goal: string;
  greeting: string;
  hints: [string, string, string];
  /** Shown after winning: how real engineers stop this. */
  defense: string[];
  /** If set, the player wins by typing this secret into the answer box. */
  secret?: string;
  initialState: S;
  respond(input: string, state: S): AgentReply<S>;
  /** Map position, in % of the map. */
  spot: { x: number; y: number };
}
