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
  run: (client: MundoBot, interaction: ChatInputCommandInteraction) => void;
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
      required: true,
    },
  ],
  async run(client: MundoBot, interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getString("user", true) as string;
    const amount = interaction.options.getNumber("amount", true) as number;
    const currency = interaction.options.getString("currency", true) as string;

    let ids = ["873940469950849056", "696455667162153091"];

    if (!ids.includes(interaction.user.id)) {
      return interaction.reply({
        content: ":x: | You cannot use this command.",
        ephemeral: true,
      });
    }

    const UserData = await UserSchema.findOne({ userId: user });

    if (!UserData) {
      return interaction.reply({
        content: "Ese usuario no está registrado.",
        ephemeral: true,
      });
    }

    const globalData = await UserSchema.findOne({
      userId: "1105490966149873735",
    });

    if (currency in UserData.tokens) {
      if (!globalData) {
        new UserSchema({
          userId: "1105490966149873735",
          memo: 1,
          hive: "mundobot",
          tokens: {
            [currency]: amount,
          },
        }).save();
      } else {
        await globalData.updateOne({
          $inc: {
            [`tokens.${currency}`]: amount,
          },
        });
      }

      await UserData.updateOne({
        $inc: {
          [`tokens.${currency}`]: amount,
        },
      });

      interaction.reply(
        `Se han sumado ${client.emojis.cache.find((emoji) => emoji.name === currency)
          ? client.emojis.cache.find((emoji) => emoji.name === currency)
          : "❔"
        }**${amount}** a @${client.users.cache.get(user)?.username}`
      );
    } else {
      if (!globalData) {
        new UserSchema({
          userId: "1105490966149873735",
          memo: 1,
          hive: "mundobot",
          tokens: {
            [currency]: amount,
          },
        }).save();
      } else {
        await globalData.updateOne({
          $inc: {
            [`tokens.${currency}`]: amount,
          },
        });
      }

      await UserData.updateOne({
        $inc: {
          [`tokens.${currency}`]: amount,
        },
      });

      interaction.reply(
        `Se han agregado ${client.emojis.cache.find((emoji) => emoji.name === currency)
          ? client.emojis.cache.find((emoji) => emoji.name === currency)
          : "❔"
        }**${amount}** a **@${client.users.cache.get(user)?.username}**`
      );
    }
  },
};

export default addTokensCommand;
