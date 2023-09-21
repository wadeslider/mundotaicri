import MundoBot from "../../structures/MundoBot";

export default {
  name: "ready",
  run(client: MundoBot) {
    client.application?.commands.set(client.slashCommands.map((x) => x));

    console.log("Sistema encedido");
  },
};
