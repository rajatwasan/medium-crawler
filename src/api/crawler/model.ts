import * as Mongoose from "mongoose";

// mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});
export interface IUrl extends Mongoose.Document {
  url: string;
  refCount: number;
  params: string[];
}
const urlSchema = new Mongoose.Schema({
    url: { type: String, unique: true },
    refCount: { type: Number },
    params: { type: [String] }
});

export const UrlModel = Mongoose.model<IUrl>("url", urlSchema);
