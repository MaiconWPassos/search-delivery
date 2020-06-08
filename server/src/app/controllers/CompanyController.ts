import { Request, Response } from 'express';

import knex from '../../database/connection';

class CompanyController {
  async index(req: Request, res: Response) {
    const { city, uf, services } = req.query;

    const parsedServices = String(services)
      .split(',')
      .map((item) => Number(item.trim()));

    const companies = await knex('companies')
      .join(
        'companies_services',
        'companies.id',
        '=',
        'companies_services.company_id'
      )
      .whereIn('companies_services.service_id', parsedServices)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('companies.*');

    const serializedCompany = companies.map((company) => {
      return {
        ...company,
        image_url: `${process.env.APP_URL}/uploads/${company.image}`,
      };
    });

    return res.json(serializedCompany);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const company = await knex('companies').where('id', id).first();

    if (!company) {
      return res.status(400).json({ message: 'Companhia não existe!' });
    }

    const services = await knex('services')
      .join(
        'companies_services',
        'services.id',
        '=',
        'companies_services.service_id'
      )
      .where('companies_services.company_id', id);

    const serializedCompany = {
      ...company,
      image_url: `${process.env.APP_URL}/uploads/${company.image}`,
    };

    return res.json({ company: serializedCompany, services });
  }

  async store(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      services,
    } = req.body;

    const company = {
      image: req.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const trx = await knex.transaction();

    const [company_id] = await trx('companies').insert(company);

    const companyServices = services
      .split(',')
      .map((service: string) => Number(service.trim()))
      .map((service_id: number) => {
        return {
          service_id,
          company_id,
        };
      });

    await trx('companies_services').insert(companyServices);

    trx.commit();
    return res.json({
      id: company_id,
      ...company,
    });
  }
}

export default new CompanyController();
