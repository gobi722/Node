import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), 
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Ensure ConfigModule is imported
      inject: [ConfigService], // Inject ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Use ConfigService to access JWT_SECRET
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
