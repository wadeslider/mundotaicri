import MundoBot from "../../structures/MundoBot";

// Define una interfaz para la estructura del evento
interface EventReady {
  name: string;
  run: (client: MundoBot) => void;
}

const eventReady: EventReady = {
  name: "ready",
  run(client: MundoBot) {
    client.application?.commands.set(client.slashCommands.map((x) => x));

    console.log("Sistema encedido");
  },
};

export default eventReady;
