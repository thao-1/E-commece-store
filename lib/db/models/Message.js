import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ConversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
    },
    lastMessage: {
        type: String,
    },
    lastMessageDate: {
        type: Date,
        default: Date.now,
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: {},
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Update 'updatedAt' on save
ConversationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);

export { Message, Conversation };

