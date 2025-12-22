import { Module } from '@nestjs/common';
import { AgronomistController } from './agronomist.controller';
import { AgronomistService } from './agronomist.service';

@Module({
  controllers: [AgronomistController],
  providers: [AgronomistService],
})
export class AgronomistModule {}
