import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../common/database/abstract.entity';

@ObjectType()
@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop({ unique: true })
  @Field()
  email: string;

  @Prop()
  @HideField()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
