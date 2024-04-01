import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config, database, up } from 'migrate-mongo';

@Injectable()
export class DbMigrationsService implements OnModuleInit {
  dbMigrationConfig: Partial<config.Config> = {
    mongodb: {
      url: this.configService.getOrThrow<string>('MONGODB_URI'),
      databaseName: this.configService.getOrThrow<string>('DB_NAME'),
    },
    migrationsDir: `${__dirname}/../../migrations`,
    changelogCollectionName: 'changelog',
    migrationFileExtension: '.js',
  };

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    config.set(this.dbMigrationConfig);
    const { db, client } = await database.connect();
    await up(db, client);
  }
}
