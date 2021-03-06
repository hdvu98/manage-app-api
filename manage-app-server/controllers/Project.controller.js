const moment = require('moment');
const Project = require('./../models/Project.model');
const Member = require('./../models/Member.model');

const {
  projectNameValidation,
  objectIDValidation,
} = require('./../utils/helpers');
module.exports = {
  createProject: (req, res, next) => {
    var { project_name, description } = req.body;
    if (!project_name) {
      return res.status(400).send({
        message: 'project_name field is required',
      });
    }
    if (!projectNameValidation(project_name))
      return res.status(400).send({
        message: 'project_name format is invalid',
      });
    var project = { project_name, description };
    Project.create(project)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  },
  getProjects: (req, res, next) => {
    Project.get({})
      .then((data) => res.send(data))
      .catch((err) => res.status(400).send({ message: err.message }));
  },
  getProjectByID: (req, res, next) => {
    Project.get({ _id: req.params.id })
      .then(async (data) => {
        if (data.length > 0) {
          var project = data[0];
          const { assignees } = project;
          var assigneesInfo = [];
          if (assignees && assignees.length > 0) {
            assigneesInfo = await Promise.all(
              assignees.map(async (item) => {
                let info;
                try {
                  info = await Member.get({ _id: item });
                  if (info.length > 0) return info[0];
                  return null;
                } catch (err) {
                  return null;
                }
              })
            );
            assigneesInfo = assigneesInfo.filter(function (el) {
              return el != null;
            });
          }
          project.assignees = assigneesInfo;
          return res.send(project);
        }
        return res.send(data);
      })
      .catch((err) => res.status(400).send({ message: err.message }));
  },
  updateProject: (req, res, next) => {
    var { project_name, description } = req.body;
    var project = {};
    if (project_name) {
      if (!projectNameValidation(project_name))
        return res.status(400).send({
          message: 'project_name format is invalid',
        });
      project = { ...project, project_name: project_name };
    }
    if (description) {
      if (description.length > 1000)
        return res.status(400).send({
          message: 'Description must have fewer than 1000 characters',
        });
      project = { ...project, description: description };
    }

    Project.update({ _id: req.params.id }, project)
      .then((data) => {
        if (!data)
          return res.status(400).send({ message: 'the project is not exits' });
        return res.send(data);
      })
      .catch((err) => res.status(400).send({ message: err.message }));
  },
  remove: (req, res, next) => {
    const { id } = req.params;
    if (!id) return res.status(400).send({ message: 'invaid id' });
    Project.delete({ _id: id })
      .then((data) => {
        if (data) return res.send({ message: `removed the project: ${id}` });
        else
          return res
            .status(400)
            .send({ message: 'the project id is not exits' });
      })
      .catch((err) => res.status(400).send({ message: err.message }));
  },
  assignMemberToProject: async (req, res, next) => {
    var { assignee } = req.body;
    var { id } = req.params;
    if (!id || !objectIDValidation(id))
      return res.status(400).send({ message: 'project ID is Invalid' });
    if (!assignee || !objectIDValidation(assignee)) {
      return res.status(400).send({ message: 'Member id is Invalid' });
    }
    try {
      var member = await Member.get({ _id: assignee });
      if (!member.length) {
        return res.status(400).send({ message: 'member ID is not exits' });
      }
    } catch (err) {
      return res.status(400).send({ message: 'error when find member ID' });
    }
    Project.get({ _id: id })
      .then((data) => {
        if (data.length) {
          data[0]
            .assign(assignee)
            .then((data) => {
              return res.send(data);
            })
            .catch((err) => res.status(400).send({ message: err.message }));
        } else {
          return res.status(400).send({ message: 'project ID is not exits' });
        }
      })
      .catch((err) => res.status(400).send({ message: err.message }));
  },
  removeMemberFromProject: async (req, res, next) => {
    var { assignee } = req.body;
    var { id } = req.params;
    if (!id || !objectIDValidation(id))
      return res.status(400).send({ message: 'project ID is Invalid' });
    if (!assignee || !objectIDValidation(assignee)) {
      return res.status(400).send({ message: 'Member id is Invalid' });
    }
    try {
      var member = await Member.get({ _id: assignee });
      if (!member.length) {
        return res.status(400).send({ message: 'member ID is not exits' });
      }
    } catch (err) {
      return res.status(400).send({ message: 'error when find member ID' });
    }
    Project.get({ _id: id })
      .then((data) => {
        if (data.length) {
          data[0]
            .removeMember(assignee)
            .then((data) => {
              return res.send(data);
            })
            .catch((err) => res.status(400).send({ message: err.message }));
        } else {
          return res.status(400).send({ message: 'project ID is not exits' });
        }
      })
      .catch((err) => res.status(400).send({ message: err.message }));
  },
  getAvailableMember: async (req, res, next) => {
    var { id } = req.params;
    if (!id || !objectIDValidation(id))
      return res.status(400).send({ message: 'project ID is Invalid' });
    var members = [];
    var memberInProject = [];
    try {
      members = await Member.get({});
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }
    try {
      var projects = await Project.get({ _id: id });
      if (projects.length) {
        memberInProject = projects[0].assignees;
      } else return res.status(400).send({ message: 'project is not exists' });
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }
    var available = members.filter(
      (item) => !memberInProject.includes(item._id)
    );
    return res.send(available);
  },
};
