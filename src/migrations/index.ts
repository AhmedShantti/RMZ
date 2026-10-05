import * as migration_20260729_121316 from './20260729_121316';
import * as migration_20260921_135015_add_client_card_project from './20260921_135015_add_client_card_project';
import * as migration_20260922_101455_add_categories from './20260922_101455_add_categories';
import * as migration_20260930_100000_home_stairs_title_showreel_hd from './20260930_100000_home_stairs_title_showreel_hd';
import * as migration_20260930_140000_about_banner_zigzag_images from './20260930_140000_about_banner_zigzag_images';
import * as migration_20261001_100000_about_banner_title from './20261001_100000_about_banner_title';
import * as migration_20261001_120000_portfolio_banner from './20261001_120000_portfolio_banner';
import * as migration_20261004_110000_contact_cms_fields from './20261004_110000_contact_cms_fields';
import * as migration_20261004_130000_services_portfolio_category from './20261004_130000_services_portfolio_category';
import * as migration_20261004_150000_bts_content from './20261004_150000_bts_content';
import * as migration_20261005_100000_bts_video_link from './20261005_100000_bts_video_link';
import * as migration_20261006_100000_bts_landscape from './20261006_100000_bts_landscape';
import * as migration_20261007_100000_project_video_vertical from './20261007_100000_project_video_vertical';

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
  {
    up: migration_20261001_120000_portfolio_banner.up,
    down: migration_20261001_120000_portfolio_banner.down,
    name: '20261001_120000_portfolio_banner',
  },
  {
    up: migration_20261004_110000_contact_cms_fields.up,
    down: migration_20261004_110000_contact_cms_fields.down,
    name: '20261004_110000_contact_cms_fields',
  },
  {
    up: migration_20261004_130000_services_portfolio_category.up,
    down: migration_20261004_130000_services_portfolio_category.down,
    name: '20261004_130000_services_portfolio_category',
  },
  {
    up: migration_20261004_150000_bts_content.up,
    down: migration_20261004_150000_bts_content.down,
    name: '20261004_150000_bts_content',
  },
  {
    up: migration_20261005_100000_bts_video_link.up,
    down: migration_20261005_100000_bts_video_link.down,
    name: '20261005_100000_bts_video_link',
  },
  {
    up: migration_20261006_100000_bts_landscape.up,
    down: migration_20261006_100000_bts_landscape.down,
    name: '20261006_100000_bts_landscape',
  },
  {
    up: migration_20261007_100000_project_video_vertical.up,
    down: migration_20261007_100000_project_video_vertical.down,
    name: '20261007_100000_project_video_vertical',
  },
];
