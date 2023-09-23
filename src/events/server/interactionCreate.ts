import { Collection, Interaction } from "discord.js";
import MundoBot from "../../structures/MundoBot";

// Define una interfaz para la estructura del evento
interface EventInteractionCreate {
  name: string;
  run: (client: MundoBot, interaction: Interaction) => void;
}

const eventInteractionCreate: EventInteractionCreate = {
  name: "interactionCreate",
  async run(client: MundoBot, interaction: Interaction) {

    if (interaction.isButton() && interaction.customId == client.Airdrops.config.addParticipantButtonId) {
      client.Airdrops.ButtonInteraction(interaction)
    }

    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);

    if (!interaction.guildId) {
      return interaction.reply({
        content:
          "👋 `|` Por motivos personales, prefiero no hacer comandos por privado, gracias. ✨",
        ephemeral: true,
      });
    }

    const { cooldowns } = client;

    if (!cooldowns.has(command?.name!)) {
      cooldowns.set(command?.name!, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command?.name!);
    const defaultCooldownDuration = 3;
    const cooldownAmount =
      (command?.cooldown! ?? defaultCooldownDuration) * 1000;

    if (timestamps?.has(interaction.user.id)) {
      const expirationTime =
        timestamps?.get(interaction.user.id)! + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        return interaction.reply({
          content: `Por favor, espera, estás en un enfriamiento para \`${command?.name}\`. Puedes usarlo nuevamente <t:${expiredTimestamp}:R>.`,
          ephemeral: true,
        });
      }
    }

    timestamps?.set(interaction.user.id, now);
    setTimeout(() => timestamps?.delete(interaction.user.id), cooldownAmount);

    try {
      await command?.run(client, interaction);
    } catch (error) {
      console.error(`Error al ejecutar ${interaction.commandName}`);
      console.error(error);
    }
  },
};

export default eventInteractionCreate;