import express from 'express';
import { validate } from "../middleware/validate";
import { projectSchema } from "../schemas/projectSchema";
import { TagSchema } from "../schemas/tagSchema";
import { validateAndAuthorizeToken } from '../middleware/jwt';
import { 
  createProjectHandler, 
  getAllProjectHandler,
  getSingleProjectHandler,
  getAllProjectWithIdHandler
} from '../controllers/projectController';
import {createTagHandler, getTagFromProjectHandler} from "../controllers/tagController";

const router = express.Router();

router.post(
  '/create', 
  validate(projectSchema),
  validateAndAuthorizeToken,
  createProjectHandler
);

router.get(
  '/get',
  validateAndAuthorizeToken,
  getAllProjectHandler
)

// Will use in the future
// router.get(
//   '/get/:id',
//   validateAndAuthorizeToken,
//   getSingleProjectHandler
// )

// To be removed
router.get(
  '/get/:userId',
  getAllProjectWithIdHandler
)
//Tag
router.post(
    '/createTag/:id',
    validate(TagSchema),
    createTagHandler,
);
router.get(
    '/getTag/:id',
    getTagFromProjectHandler
)

export default router;
