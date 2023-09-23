import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import MundoBot from "../../structures/MundoBot";
import UserSchema from "../../schemas/User";

// Define una interfaz para la estructura del comando
interface CommandBalanace {
  name: string;
  description: string;
  options: {
    name: string;
    description: string;
    type: number;
    required: boolean;
  }[];
  run: (
    client: MundoBot,
    interaction: ChatInputCommandInteraction
  ) => Promise<void>;
}

const balanceCommand: CommandBalanace = {
  name: "balance",
  description: "To see your currency",
  options: [
    {
      name: "user",
      description: "Mention the user",
      type: 6,
      required: false,
    },
  ],
  async run(client: MundoBot, interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user") || interaction.user;

    const UserData = await UserSchema.findOne({ userId: user.id });

    if (!UserData) {
      if (user.id === interaction.user.id) {
        interaction.reply({
          content: ":x: `|` You cannot use this command, you need to register.",
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: ":x: `|` The person you mentioned is not registered.",
        });
      }

      return;
    }

    const embed = new EmbedBuilder().setColor(client.color).setAuthor({
      name: `${user.username}'s balances`,
      iconURL: user.displayAvatarURL({
        size: 4096,
      }),
    });

    for (const [token, amount] of Object.entries(UserData.tokens)) {
      if (user.id === "1105490966149873735") {
        embed.addFields({
          name: token.charAt(0).toUpperCase() + token.slice(1),
          value: `${
            client.emojis.cache.find((emoji) => emoji.name === token)
              ? client.emojis.cache.find((emoji) => emoji.name === token)
              : "❔"
          } \`${amount.toLocaleString("en-US", {
            maximumFractionDigits: 3,
            notation: "compact",
            compactDisplay: "short",
          })}\``,
          inline: true,
        });
      } else {
        if (amount >= 1) {
          embed.addFields({
            name: token.charAt(0).toUpperCase() + token.slice(1),
            value: `${
              client.emojis.cache.find((emoji) => emoji.name === token)
                ? client.emojis.cache.find((emoji) => emoji.name === token)
                : "❔"
            } \`${amount.toLocaleString("en-US", {
              maximumFractionDigits: 3,
              notation: "compact",
              compactDisplay: "short",
            })}\``,
            inline: true,
          });
        }
      }
    }

    interaction.reply({
      embeds: [embed],
    });
  },
};

export default balanceCommand;
