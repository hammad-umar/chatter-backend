import { Injectable } from '@nestjs/common';
import { hash as bcryptHash, compare as bcryptCompare, genSalt } from 'bcrypt';

@Injectable()
export class BcryptService {
  async hash(plainStr: string): Promise<string> {
    const saltOrRounds = await genSalt(10);
    return bcryptHash(plainStr, saltOrRounds);
  }

  async compare(plainStr: string, hashedStr: string): Promise<boolean> {
    return bcryptCompare(plainStr, hashedStr);
  }
}
