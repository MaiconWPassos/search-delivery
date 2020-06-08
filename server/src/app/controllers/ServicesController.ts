import { Request, Response } from 'express';

import knex from '../../database/connection';

class ServicesController {
  async index(req: Request, res: Response) {
    const services = await knex('services').select('*');

    const serializedServices = services.map((service) => {
      return {
        ...service,
        image_url: `${process.env.APP_URL}/uploads/${service.image}`,
      };
    });

    return res.json(serializedServices);
  }
}

export default new ServicesController();
