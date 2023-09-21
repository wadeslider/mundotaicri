import fs from "node:fs";
import MundoBot from "../structures/MundoBot";

export default function (client: MundoBot) {
  try {
    fs.readdirSync("./dist/slashCommands/").forEach(async (folder) => {
      const slashCommands = fs
        .readdirSync(`./dist/slashCommands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      for (const file of slashCommands) {
        const pull = (await import(`../slashCommands/${folder}/${file}`))
          .default;

        if (pull.name && pull.run) {
          client.slashCommands.set(pull.name, pull);
        } else {
          console.error(`El comando ${file} esta mal configurado.`);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
}
