const fs = require("fs");
const { command, isPrivate } = require("../lib");
const gemini = require("../lib/Gemini");

command(
  {
    pattern: "ai",
    fromMe: isPrivate,
    desc: "Generate text with gemini",
    type: "user",
  },
  async (message, match, m) => {
    match = match || message.reply_message.text;
    const id = message.participant;
    console.log(id);
    if (process.cwd() !== "zeta") return message.reply("use og version myra");
    if (!match) return await message.reply("Provide a prompt");
    if (message.reply_message && message.reply_message.video)
      return await message.reply("I can't generate text from video");
    if (
      message.reply_message &&
      (message.reply_message.image || message.reply_message.sticker)
    ) {
      const image = await m.quoted.download();

      fs.writeFileSync("image.jpg", image);
      const text = await gemini(match, image, {
        id
      });
      return await message.reply(text);
    }
    match = message.reply_message
      ? message.reply_message.text + `\n\n${match || ""}`
      : match;
    const text = await gemini(match, null, { id });
    return await message.reply(text);
  }
);
