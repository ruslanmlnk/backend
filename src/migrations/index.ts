import * as migration_20251221_add_contact_requests_lock from './20251221_add_contact_requests_lock';
import * as migration_20251225_120809 from './20251225_120809';
import * as migration_20260117_190000 from './20260117_190000';

export const migrations = [
  {
    up: migration_20251221_add_contact_requests_lock.up,
    down: migration_20251221_add_contact_requests_lock.down,
    name: '20251221_add_contact_requests_lock',
  },
  {
    up: migration_20251225_120809.up,
    down: migration_20251225_120809.down,
    name: '20251225_120809'
  },
  {
    up: migration_20260117_190000.up,
    down: migration_20260117_190000.down,
    name: '20260117_190000'
  },
];
