import mongoose from 'mongoose';

function gettime(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    var hour = String(date.getHours()).padStart(2, "0");
    var minute = String(date.getMinutes()).padStart(2, "0");
    return `${year}${month}${day} ${hour}${minute}`;
}

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        passwordHash: { type: String, required: true },
        role: { type: String, required: true, enum: ['student', 'faculty'] },
        files: [
            {
                fileName: {
                    type: String,
                    required: true,
                    default: '',
                },
                previewImage: {
                    type: String,
                    required: true,
                    default: '',
                },
                tags: {
                    type: [String],
                    default: [],
                },
                title:{
                    type:String,
                    default:"Untitled",
                    required:true
                }
            }
        ],
        tags: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

let User;
if (mongoose.models.User) {
    User = mongoose.models.User;
} else {
    User = mongoose.model('User', UserSchema);
}

UserSchema.path('createdAt').get(gettime);
UserSchema.path('updatedAt').get(gettime);

export default User;