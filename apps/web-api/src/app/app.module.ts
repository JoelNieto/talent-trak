import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AuthzModule } from '../authz/authz.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChargeConceptsModule } from './charge-concepts/charge-concepts.module';
import { ChargeConceptEntity } from './charge-concepts/entities/charge-concept.entity';
import { ChargesModule } from './charges/charges.module';
import { ChargeEntity } from './charges/entities/charge.entity';
import { CompaniesModule } from './companies/companies.module';
import { CompanyEntity } from './companies/entities/company.entity';
import { EventTypeEntity } from './event-types/entities/event-type.entity';
import { EventTypesModule } from './event-types/event-types.module';
import { EventEntity } from './events/entities/event.entity';
import { EventsModule } from './events/events.module';
import { FilesModule } from './files/files.module';
import { ItemTypeEntity } from './item-types/entities/item-type.entity';
import { ItemTypesModule } from './item-types/item-types.module';
import { ItemEntity } from './items/entities/item.entity';
import { ItemsModule } from './items/items.module';
import { PaymentEntity } from './payments/entities/payment.entity';
import { PaymentsModule } from './payments/payments.module';
import { RoleEntity } from './roles/entities/role.entity';
import { RolesModule } from './roles/roles.module';
import { UserEntity } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.test.env' }),
    UsersModule,
    AuthzModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        ssl: {
          ca: readFileSync(
            join(process.cwd(), 'apps', 'web-api', 'src', 'cert', 'cert.pem')
          ),
        },

        logging: true,
        autoLoadEntities: true,
        synchronize: true,
        entities: [
          CompanyEntity,
          ItemTypeEntity,
          RoleEntity,
          UserEntity,
          EventTypeEntity,
          ItemEntity,
          ChargeConceptEntity,
          ChargeEntity,
          PaymentEntity,
          EventEntity,
        ],
      }),
      inject: [ConfigService],
    }),
    CompaniesModule,
    ItemTypesModule,
    RolesModule,
    EventTypesModule,
    FilesModule,
    ItemsModule,
    ChargeConceptsModule,
    ChargesModule,
    PaymentsModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
