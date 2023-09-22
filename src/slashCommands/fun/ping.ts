import { ChatInputCommandInteraction } from "discord.js";
import MundoBot from "../../structures/MundoBot";

// Define una interfaz para la estructura del comando
interface CommandPing {
  name: string;
  description: string;
  run: (client: MundoBot, interaction: ChatInputCommandInteraction) => Promise<void>;
}

const pingCommand: CommandPing = {
  name: "ping",
  description: "To see the latency of the bot.",
  async run(client: MundoBot, interaction: ChatInputCommandInteraction) {
    interaction.reply("Pong! 🏓").then((i) => {
      interaction.editReply(
        `Pong! 🏓\n> Latency is **${i.createdTimestamp - interaction.createdTimestamp}**ms. ✨\n> API Latency is **${client.ws.ping}**ms. 🃏`
      );
    });
  },
};

export default pingCommand;