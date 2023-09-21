import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import MundoBot from "../../structures/MundoBot";

export default {
  name: "ping",
  description: "To see the latency of the bot.",
  async run(client: MundoBot, interaction: ChatInputCommandInteraction) {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.color)
          .setDescription("pong... 🏓")
          .setFooter({
            text: client.user?.username!,
            iconURL: client.user?.displayAvatarURL({
              size: 4096,
            }),
          })
          .setTimestamp(),
      ],
    }).then((m) => {


      interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setColor(client.color)
          .setDescription(
            `🤖 \`|\` Bot: **${
              Date.now() - m.createdTimestamp
            }ms**\n📡 \`|\` Api: **${client.ws.ping}ms**`
          )
          .setFooter({
            text: client.user?.username!,
            iconURL: client.user?.displayAvatarURL({
              size: 4096,
            }),
          })
          .setTimestamp(),
        ]
      })
    })
  },
};
