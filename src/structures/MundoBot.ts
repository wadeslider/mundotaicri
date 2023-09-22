import {
  Client,
  ClientOptions,
  Collection,
  CacheType,
  Message,
  ChatInputCommandInteraction,
  ColorResolvable,
  HexColorString,
} from "discord.js";
import "dotenv/config";
import mongoose from "mongoose";

export interface LocalSlashCommandContent {
  type?: 1 | 2 | 3;
  name: string;
  name_localizations?: [];
  description: string;
  description_localizations?: [];
  options?: [
    {
      name: string;
      description: string;
      type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
      required: boolean;
      choices?: [
        {
          name: string;
          value: string;
        }
      ]
    }
  ];
  default_member_permissions?: string;
  dm_permission?: boolean;
  default_permission?: boolean;
  nsfw?: boolean;
  cooldown?: number;
  run(
    ...args: (MundoBot | ChatInputCommandInteraction<CacheType>)[]
  ): Promise<any> | any;
}

export default class MundoBot extends Client {
  public slashCommands: Collection<string, LocalSlashCommandContent>;
  public cooldowns: Collection<string, Collection<string, number>>;
  public color: HexColorString;

  public constructor(options: ClientOptions) {
    super(options);

    this.slashCommands = new Collection();
    this.cooldowns = new Collection();
    this.color = "#d60411";
  }

  public async start(): Promise<void> {
    ["events", "slashCommands"].forEach(async (h) => {
      const handler = (await import(`../handlers/${h}`)).default;
      handler(this);
    });

    await this.connectMongoDB();
    await this.login(process.env.TOKEN);
  }

  public async connectMongoDB(): Promise<void> {
    mongoose.set("strictQuery", true);
    const mongoSecret: string = process.env.MONGODB_URL ?? "none";
    await mongoose.connect(mongoSecret)
  }
}
