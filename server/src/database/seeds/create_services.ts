import Knex from 'knex';

export async function seed(knex: Knex) {
  await knex('services').insert([
    {
      title: 'Delivery',
      image: 'delivery.svg',
    },
    {
      title: 'Retirada no local',
      image: 'drive-thru.svg',
    },
  ]);
}
