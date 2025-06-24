import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review {
  @Prop({ required: true })
  reviewerName: string;

  @Prop({ required: true })
  rating: string;

  @Prop()
  comment?: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
