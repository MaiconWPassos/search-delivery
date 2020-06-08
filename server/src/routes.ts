import { Router } from 'express';
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';

import multerConfig from './config/multer';

import ServicesController from './app/controllers/ServicesController';
import CompanyController from './app/controllers/CompanyController';

const routes = Router();
const upload = multer(multerConfig);

routes.get('/services', ServicesController.index);

routes.post(
  '/company',
  upload.single('image'),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        services: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  CompanyController.store
);

routes.get('/company', CompanyController.index);

routes.get('/company/:id', CompanyController.show);

export default routes;
