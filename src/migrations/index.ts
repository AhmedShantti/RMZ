import * as migration_20260729_121316 from './20260729_121316';
import * as migration_20260921_135015_add_client_card_project from './20260921_135015_add_client_card_project';
import * as migration_20260922_101455_add_categories from './20260922_101455_add_categories';
import * as migration_20260930_100000_home_stairs_title_showreel_hd from './20260930_100000_home_stairs_title_showreel_hd';
import * as migration_20260930_140000_about_banner_zigzag_images from './20260930_140000_about_banner_zigzag_images';
import * as migration_20261001_100000_about_banner_title from './20261001_100000_about_banner_title';

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
  {
    up: migration_20260930_100000_home_stairs_title_showreel_hd.up,
    down: migration_20260930_100000_home_stairs_title_showreel_hd.down,
    name: '20260930_100000_home_stairs_title_showreel_hd',
  },
  {
    up: migration_20260930_140000_about_banner_zigzag_images.up,
    down: migration_20260930_140000_about_banner_zigzag_images.down,
    name: '20260930_140000_about_banner_zigzag_images',
  },
  {
    up: migration_20261001_100000_about_banner_title.up,
    down: migration_20261001_100000_about_banner_title.down,
    name: '20261001_100000_about_banner_title',
  },
];
