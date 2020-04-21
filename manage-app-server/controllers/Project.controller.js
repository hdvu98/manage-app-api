const moment = require('moment');
const Project = require('./../models/Project.model');
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
  getProjectByID: (req, res, next) => {},
  updateProject: (req, res, next) => {},
  remove: (req, res, next) => {},
};
