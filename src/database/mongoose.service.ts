import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createMongooseOptions(): MongooseModuleOptions {
    const user = this.configService.get('database.username', { infer: true });
    const password = this.configService.get('database.password', { infer: true });
    const host = this.configService.get('database.host', { infer: true });
    const port = this.configService.get('database.port', { infer: true });
    const dbName = this.configService.get('database.name', { infer: true });

    const isLocal = this.configService.get('database.isLocal', { infer: true });

    return {
      uri: isLocal
        ? `mongodb://${user}:${password}@${host}:${port}`
        : `mongodb+srv://${user}:${password}@${host}/?retryWrites=true&w=majority`,
      dbName,
    };
  }
}
