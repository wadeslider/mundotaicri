import { ChatInputCommandInteraction } from "discord.js";
import MundoBot from "../../structures/MundoBot";
import UserSchema from "../../schemas/User";
import MemoSchema from "../../schemas/memo";

// Define una interfaz para la estructura del comando
interface CommandRegister {
  name: string;
  description: string;
  options: {
    name: string;
    description: string;
    type: number;
    required: boolean;
  }[];
  dm_permission: boolean;
  run: (client: MundoBot, interaction: ChatInputCommandInteraction) => void;
}

const registerCommand: CommandRegister = {
  name: "register",
  description: "To register",
  options: [
    {
      name: "hive",
      description: "Write your hive name",
      type: 3,
      required: true,
    },
  ],
  dm_permission: false,
  async run(client: MundoBot, interaction: ChatInputCommandInteraction) {
    const hive = interaction.options.getString("hive") as string;

    const hiveData = await UserSchema.findOne({ hive: hive });

    if (hiveData)
      return interaction.reply({
        content:
          ":x: `|` Esa cuenta de hive, ya esta registrada en otra cuenta.",
        ephemeral: true,
      });

    const UserData = await UserSchema.findOne({ userId: interaction.user.id });

    if (UserData) {
      await UserData.updateOne({
        hive: hive,
      });

      return interaction.reply("✅ `|` Data updated correctly.");
    }

    const MemoData = await MemoSchema.findOne({
      id: "b",
    });

    let memo;
    if (MemoData) {
      memo = MemoData.memo;

      MemoData.memo += 1;
      MemoData.save();
    } else {
      memo = 1;
      new MemoSchema({
        id: "b",
        memo: 2,
      }).save();
    }

    new UserSchema({
      userId: interaction.user.id,
      memo: memo,
      hive: hive,
      tokens: {},
    }).save();

    interaction.reply("✅ `|` You have registered successfully.");
  },
};

export default registerCommand;
