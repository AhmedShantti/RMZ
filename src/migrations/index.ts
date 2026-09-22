import * as migration_20260729_121316 from './20260729_121316';
import * as migration_20260921_135015_add_client_card_project from './20260921_135015_add_client_card_project';
import * as migration_20260922_101455_add_categories from './20260922_101455_add_categories';

export const migrations = [
  {
    up: migration_20260729_121316.up,
    down: migration_20260729_121316.down,
    name: '20260729_121316',
  },
  {
    up: migration_20260921_135015_add_client_card_project.up,
    down: migration_20260921_135015_add_client_card_project.down,
    name: '20260921_135015_add_client_card_project',
  },
  {
    up: migration_20260922_101455_add_categories.up,
    down: migration_20260922_101455_add_categories.down,
    name: '20260922_101455_add_categories'
  },
];
