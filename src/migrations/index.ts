import * as migration_20260729_111016 from './20260729_111016';

export const migrations = [
  {
    up: migration_20260729_111016.up,
    down: migration_20260729_111016.down,
    name: '20260729_111016'
  },
];
