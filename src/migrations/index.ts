import * as migration_20251221_add_contact_requests_lock from './20251221_add_contact_requests_lock';

export const migrations = [
  {
    up: migration_20251221_add_contact_requests_lock.up,
    down: migration_20251221_add_contact_requests_lock.down,
    name: '20251221_add_contact_requests_lock'
  },
];
