const moment = require('moment');
const Project = require('./../models/Project.model');
const Member = require('./../models/Member.model');

const { projectNameValidation } = require('./../utils/helpers');
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
  updateProject: (req, res, next) => {},
  remove: (req, res, next) => {},
};
