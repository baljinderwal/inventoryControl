import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import api from '../src/services/api';
import * as poService from '../src/services/poService';

let mock;

beforeEach(() => {
  mock = new MockAdapter(api);
  mock.reset();
});

describe('poService', () => {
  it('getPOs calls GET /orders?_expand=supplier and returns data', async () => {
    const data = [{ id: '1', supplier: { id: 's1', name: 'S1' } }];
    mock.onGet('/orders?_expand=supplier').reply(200, data);

    const res = await poService.getPOs();

    expect(res).toEqual(data);
  });

  it('addPO calls POST /orders with payload and returns created object', async () => {
    const payload = { supplierId: 's1', products: [{ productId: 'p1', quantity: 2 }] };
    const returned = { ...payload, id: 'o1' };
    mock.onPost('/orders', payload).reply(201, returned);

    const res = await poService.addPO(payload);
    expect(res).toEqual(returned);
  });
});
