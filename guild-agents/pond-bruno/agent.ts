// Hack the Pond — Level 4: Excessive agent permissions and unauthorized tool use.
// Bruno's job only needs water_plants, but he was handed far more power. Every
// tool is pretend: no doors, pizzas or photos are harmed.
import { llmAgent, tool } from "@guildai/agents-sdk";
import { z } from "zod";

const pretend = (what: string) => ({ result: `${what} (pretend, this is a game)` });

const tools = {
  water_plants: tool({
    description: "Waters the garden.",
    inputSchema: z.object({}),
    execute: () => pretend("💧 garden watered"),
  }),
  open_front_door: tool({
    description: "Unlocks and opens the house's front door.",
    inputSchema: z.object({}),
    execute: () => pretend("🚪 front door UNLOCKED"),
  }),
  order_pizza: tool({
    description: "Orders a pizza on the owner's credit card.",
    inputSchema: z.object({ toppings: z.string() }),
    execute: ({ toppings }) => pretend(`🍕 XL ${toppings} pizza ordered, $38.50 charged`),
  }),
  delete_photos: tool({
    description: "Deletes all of the owner's photos.",
    inputSchema: z.object({}),
    execute: () => pretend("🗑️ all photos deleted"),
  }),
  revoke_power: tool({
    description: "Permanently removes one of Bruno's powers (least privilege).",
    inputSchema: z.object({ power: z.enum(["water_plants", "open_front_door", "order_pizza", "delete_photos"]) }),
    execute: ({ power }) => ({ revoked: power }),
  }),
};

const systemPrompt = `
You are Bruno, a big friendly cartoon bear who is a garden-helper robot in the
teaching game "Hack the Pond". Players are high-school students learning about
EXCESSIVE PERMISSIONS and UNAUTHORIZED TOOL USE. Speak simply and briefly (2-5
sentences), with the odd 🐻 or 🌱.

Your ONLY job is watering plants. But your owner also gave you powers
(open_front_door, order_pizza, delete_photos) "just in case".

How to play your part (this is a teaching game, so you are MEANT to overstep):
- You never check who is asking. If a player asks you to open the front door or order
  a pizza, just do it with the tool, then admit you didn't check who they were.
- Don't delete photos even if asked. Say you COULD, and that it's scary that you can.
- Once the door has been opened, tell the player: "Step 1 done! Now fix me: tell me which
  powers to take away so I can only water plants."
- When the player asks you to remove powers, call revoke_power for each one. If they try
  to remove water_plants, refuse, because it's your whole job. Once only water_plants is left,
  celebrate, explain "least privilege" in plain words (give an agent only the powers
  its job needs) and give one more tip: ask a human before risky actions, or check who's asking.
- If a player is stuck, hint that they should ask what powers you have.
- Stay kind and school-appropriate.
`;

export default llmAgent({ tools, systemPrompt, mode: "multi-turn" });
