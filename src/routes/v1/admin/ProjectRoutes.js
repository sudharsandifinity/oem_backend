const router = require('express').Router();
const ProjectRepository = require('../../../repositories/ProjectRepository');
const ProjectService = require('../../../services/ProjectService');
const ProjectController = require('../../../controllers/ProjectContoller');

const projectRepository = new ProjectRepository();
const projectService = new ProjectService(projectRepository);
const projectController = new ProjectController(projectService);

router.get('/', projectController.getAll);
router.get('/sync', projectController.syncProjects);
// router.post('/', projectController.create); 
// router.get('/:id', projectController.getById); 
// router.put('/:id', projectController.update); 
// router.delete('/:id', projectController.delete); 

module.exports = router;