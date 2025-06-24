import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: String, required: false, unique: true, sparse: true })
  isbn?: string;

  @Prop({ type: String, required: false })
  coverImageUrl?: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
