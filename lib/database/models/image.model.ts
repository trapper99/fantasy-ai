import { Document, Schema, model, models } from "mongoose";

export interface ImageModel extends Document {
    title: string;
    transformationTypes: string[];
    publicId: string;
    secureURL: string;
    width?: number;
    height?: number;
    config?: object;
    transformationUrl?: string | URL;
    aspectRatio?: string;
    color?: string;
    prompt?: string;
    author: {
        _id: string;
        firstname: string;
        lastname: string;
    }
    createdAt: Date;
    updatedAt: Date;
}

const ImageSchema = new Schema({
    title: { type: String, required: true },
    transformationTypes: { type: String, required: true },
    publicId: { type: String, required: true },
    secureURL: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    config: { type: Object },
    transformationUrl: { type: URL },
    aspectRatio: { type: String },
    color: { type: String },
    prompt: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Image = models?.Image || model('Image', ImageSchema);

export default Image;