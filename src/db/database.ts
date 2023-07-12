import { Client } from '../deps.ts';
import 'https://deno.land/x/dotenv@v3.2.0/load.ts';

class Database {
  
  public client!: Client;

  constructor() {
    this.connect();
  }

  async connect() {
    this.client = new Client({
      user: Deno.env.get('DB_USERNAME'),
      database: Deno.env.get('DB_DATABASE'),
      hostname: Deno.env.get('DB_HOSTNAME'),
      password: Deno.env.get('DB_PASSWORD'),
      port: Deno.env.get('DB_PORT')
    });

    await this.client.connect();
  }
}

export default new Database().client;