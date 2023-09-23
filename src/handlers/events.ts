import fs from "node:fs";
import MundoBot from "../structures/MundoBot";

export default function (client: MundoBot) {
  try {
    fs.readdirSync("./dist/events/").forEach(async (folder) => {
      const events = fs
        .readdirSync(`./dist/events/${folder}`)
        .filter((file) => file.endsWith(".js"));

      for (const file of events) {
        const pull = await import(`../events/${folder}/${file}`);

        if (pull.default.name && pull.default.run) {
          if (pull.default.once) {
            client.once(pull.default.name, (...args) => pull.default.run(client, ...args));
          } else {
            client.on(pull.default.name, (...args) => pull.default.run(client, ...args));
          }
        } else {
            console.error(`El evento ${file} esta mal configurado.`)
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
}
