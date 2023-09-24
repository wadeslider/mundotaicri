import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
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
      description: "Write the hive name",
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
    const currency = interaction.options
      .getString("currency", true)
      .toLowerCase() as string;

    let ids = ["873940469950849056", "696455667162153091"];

    if (!ids.includes(interaction.user.id)) {
      return interaction.reply({
        content: ":x: | You cannot use this command.",
        ephemeral: true,
      });
    }

    const UserData = await UserSchema.findOne({ hive: user });

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

      (client.channels.cache.get("1121927676966481970") as TextChannel).send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setTitle("➕ `|` Se ha agregado dinero")
            .setDescription(
              `El usuario **${interaction.user.username}** ha agregado ${
                client.emojis.cache.find((emoji) => emoji.name === currency)
                  ? client.emojis.cache.find((emoji) => emoji.name === currency)
                  : "❔"
              }**${amount}** a **@${
                client.users.cache.get(UserData.userId)?.username
              }**.`
            )
            .setFooter({
              text: client.user?.username as string,
              iconURL: client.user?.displayAvatarURL({
                size: 4096,
              }),
            })
            .setTimestamp(),
        ],
      });

      interaction.reply(
        `Se han sumado ${
          client.emojis.cache.find((emoji) => emoji.name === currency)
            ? client.emojis.cache.find((emoji) => emoji.name === currency)
            : "❔"
        }**${amount}** a **@${
          client.users.cache.get(UserData.userId)?.username
        }**`
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

      (client.channels.cache.get("1121927676966481970") as TextChannel).send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setTitle("➕ `|` Se ha agregado dinero")
            .setDescription(
              `El usuario **${interaction.user.username}** ha agregado ${
                client.emojis.cache.find((emoji) => emoji.name === currency)
                  ? client.emojis.cache.find((emoji) => emoji.name === currency)
                  : "❔"
              }**${amount}** a **@${
                client.users.cache.get(UserData.userId)?.username
              }**.`
            )
            .setFooter({
              text: client.user?.username as string,
              iconURL: client.user?.displayAvatarURL({
                size: 4096,
              }),
            })
            .setTimestamp(),
        ],
      });

      interaction.reply(
        `Se han agregado ${
          client.emojis.cache.find((emoji) => emoji.name === currency)
            ? client.emojis.cache.find((emoji) => emoji.name === currency)
            : "❔"
        }**${amount}** a **@${
          client.users.cache.get(UserData.userId)?.username
        }**`
      );
    }
  },
};

export default addTokensCommand;
