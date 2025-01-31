import mongoose from "mongoose";

const championSchema = new mongoose.Schema({
        name: {type: String},
        role: {type: String},
        region: {type: String},
        abilities: {type: String},
        lore: {type: String}
    },
{
    toJSON: {
        virtuals: true,
            versionKey: false,
            transform:(doc, ret) => {

            ret._links = {
                self: {
                    href: `http://${process.env.selfLink}/champions/${ret._id}`
                },
                collection: {
                    href: `http://${process.env.selfLink}/champions`
                }
            }

            delete ret._id
        }
    }
});

const Champion = mongoose.model('Champion', championSchema);

export default Champion;