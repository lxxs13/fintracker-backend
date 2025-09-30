import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { AccountModule } from './modules/account.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_CNN!),
    JwtModule.register({
      global: true,
      secret: process.env.SECRETORPRIVATEKEY,
      signOptions: { expiresIn: '15m' },
    }),
    UserModule,
    AuthModule,
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
