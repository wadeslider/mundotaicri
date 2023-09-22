import { ChatInputCommandInteraction } from "discord.js";
import MundoBot from "../../structures/MundoBot";
import UserSchema from "../../schemas/User";

// Define una interfaz para la estructura del comando
interface CommandAddTokens {
  name: string;
  description: string;
  options: {
    name: string;
    description: string;
    type: number;
    required: boolean;
  }[];
  run: (client: MundoBot, interaction: ChatInputCommandInteraction) => Promise<void>;
}

const addTokensCommand: CommandAddTokens = {
  name: "addtokens",
  description: "To add tokens.",
  options: [
    {
      name: "user",
      description: "Write the person's id",
      type: 3,
      required: true,
    },
    {
      name: "amount",
      description: "Write the amount you add.",
      type: 10,
      required: true,
    },
    {
      name: "currency",
      description: "Write the currency you add.",
      type: 3,
      required: true
    }
  ],
  async run(client: MundoBot, interaction: ChatInputCommandInteraction) {
    interaction.reply(`> user: ${interaction.options.getString("user")}\n> amount: ${interaction.options.getNumber("amount")}\n> currency: ${interaction.options.getString("currency")}`)
  },
};

export default addTokensCommand;
