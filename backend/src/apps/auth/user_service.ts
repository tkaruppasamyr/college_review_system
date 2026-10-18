const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    first_name: { type: String, required: [true, 'First name is required'], lowercase: true },
    last_name: { type: String, required: [true, 'Last name is required'], lowercase: true },
    email : { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, index: true },
    password: { type: String, required: [true, 'Password is required'] },
    is_admin: { type: Boolean, default: false },
    is_teacher: { type: Boolean, default: false },
    is_student: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    create_at: { type: Date, default: Date.now },
    college_id: { type: mongoose.Schema.Types.ObjectId, ref: 'College', index: true },
    last_login: Date,
})


export const UserDb = mongoose.models.user || mongoose.model('user', UserSchema);


class UserService {

    async get_email_by(email: string) {
        try{
            const user = await UserDb.findOne({ email: email });
            return user;
        }           
        catch (error) {
            return null;
        }
    }

    async create_user(user: any) {
        try{
            const result = await UserDb.create(user);
            return result;
        }           
        catch (error) {
            return null;
        }
    }
}

export const userservice = new UserService();