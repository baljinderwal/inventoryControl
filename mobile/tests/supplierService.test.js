import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import api from '../src/services/api';
import * as supplierService from '../src/services/supplierService';

let mock;

beforeEach(() => {
  mock = new MockAdapter(api);
  mock.reset();
});

describe('supplierService', () => {
  it('getSuppliers calls GET /suppliers and returns data', async () => {
    const data = [{ id: 's1', name: 'Supplier 1' }];
    mock.onGet('/suppliers').reply(200, data);

    const res = await supplierService.getSuppliers();
    expect(res).toEqual(data);
  });
});
