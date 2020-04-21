const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ProjectSchema = new mongoose.Schema(
  {
    project_name: {
      type: String,
      unique: false,
      required: true,
      trim: true,
      maxlength: 256,
    },
    description: {
      type: String,
      unique: false,
      required: false,
      maxlength: 1000,
    },
    assignees: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  },
  {
    timestamps: true,
  }
);

ProjectSchema.methods.assign = function (member) {
  if (this.assignees.includes(member))
    throw new Error('member has alredy existed in the project');
  this.assignees.push(member);
  return this.save();
};
ProjectSchema.methods.removeMember = function (member) {
  if (!this.assignees.includes(member))
    throw new Error('member is not exists in the project');
  _.remove(this.assignees, function (id) {
    return id === member;
  });
  return this.save();
};
ProjectSchema.statics = {
  create: function (data) {
    var newProject = new this(data);
    return newProject.save();
  },

  get: function (query) {
    return this.find(query);
  },

  getByID: function (query) {
    return this.find(query);
  },
  update: function (query, updateData) {
    return this.findOneAndUpdate(query, { $set: updateData }, { new: true });
  },

  delete: function (query) {
    return this.findOneAndDelete(query);
  },
};

module.exports = mongoose.model('Project', ProjectSchema);
