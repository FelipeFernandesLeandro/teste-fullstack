import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Book } from '../../books/schemas/book.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: String, required: true })
  reviewerName: string;

  @Prop({ type: Number, required: true })
  rating: number;

  @Prop({ type: String, required: false })
  comment?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Book', required: true })
  bookId: Book;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
