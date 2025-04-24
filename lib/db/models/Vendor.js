import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    shopName: {
        type: String,
        required: [true, "Please provide a shop name"],
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, "Please provide a description for your shop"],
        trim: true,
    },
    logo: {
        type: String,
        default: '/images/default-shop-logo.png',
    },
    banner: {
        type: String,
        default: '/images/default-shop-banner.png',
    },
    contactEmail: {
        type: String,
        required: [true, "Please provide an email for contact"],
        trim: true,
        lowercase: true,
    },
    contactPhone: {
        type: String,
        trim: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
    },
    totalRatings: {
        type: Number,
        default: 0,
    },
    followers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
    },
],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);

