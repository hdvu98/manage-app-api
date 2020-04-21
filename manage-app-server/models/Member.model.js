const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let MemberSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      unique: false,
      required: true,
      trim: true,
      maxlength: 100,
    },
    phone_number: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      maxlength: 10,
    },
    birthday: {
      type: Date,
      unique: false,
      required: true,
    },
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  },
  {
    timestamps: true,
  }
);

MemberSchema.methods.joinProject = function (c) {
  this.projects.push(c);
  return this.save();
};
MemberSchema.statics = {
  create: function (data) {
    var newMember = new this(data);
    return newMember.save();
  },

  get: function (query) {
    return this.find(query);
  },

  getByID: function (query) {
    return this.findOne(query);
  },
  update: function (query, updateData) {
    return this.findOneAndUpdate(query, { $set: updateData }, { new: true });
  },

  delete: function (query) {
    return this.findOneAndDelete(query);
  },
};

module.exports = mongoose.model('Member', MemberSchema);
