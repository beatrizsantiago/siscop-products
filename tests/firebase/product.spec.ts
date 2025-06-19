import { firebaseProduct } from '../../src/firebase/product';
import Product from '../../src/domain/entities/Product';
import {
  addDoc, collection, deleteDoc, doc,
  getDocs, updateDoc, query, orderBy,
  startAt, endAt
} from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  startAt: jest.fn(),
  endAt: jest.fn(),
  where: jest.fn(),
  limit: jest.fn(),
}));

describe('FirebaseProduct', () => {
  const product: Product = {
    id: '123',
    name: 'Test Product',
    unit_value: 10,
    cycle_days: 30,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a product and return it with an id', async () => {
    (addDoc as jest.Mock).mockResolvedValue({ id: 'generated-id' });
    (collection as jest.Mock).mockReturnValue('mock-collection');

    const result = await firebaseProduct.add(product);

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'products');
    expect(addDoc).toHaveBeenCalledWith('mock-collection', {
      name: product.name,
      unit_value: product.unit_value,
      cycle_days: product.cycle_days,
    });

    expect(result).toEqual({ ...product, id: 'generated-id' });
  });

  it('should get all products', async () => {
    (collection as jest.Mock).mockReturnValue('mock-collection');
    (query as jest.Mock).mockReturnValue('mock-query');
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        { id: '1', data: () => ({ name: 'A', unit_value: 1, cycle_days: 1 }) },
        { id: '2', data: () => ({ name: 'B', unit_value: 2, cycle_days: 2 }) },
      ]
    });

    const result = await firebaseProduct.getAll();

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'products');
    expect(getDocs).toHaveBeenCalledWith('mock-query');

    expect(result).toEqual([
      { id: '1', name: 'A', unit_value: 1, cycle_days: 1 },
      { id: '2', name: 'B', unit_value: 2, cycle_days: 2 },
    ]);
  });

  it('should update a product', async () => {
    (doc as jest.Mock).mockReturnValue('mock-doc');
    (updateDoc as jest.Mock).mockResolvedValue(undefined);

    const result = await firebaseProduct.update(product);

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'products', product.id);
    expect(updateDoc).toHaveBeenCalledWith('mock-doc', {
      name: product.name,
      unit_value: product.unit_value,
      cycle_days: product.cycle_days,
    });

    expect(result).toEqual(product);
  });

  it('should return true if product is referenced', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
    });

    const result = await firebaseProduct.isProductReferenced('goals', 'product1');
    expect(result).toBe(true);
  });

  it('should return false if product is not referenced', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({
      empty: true,
    });

    const result = await firebaseProduct.isProductReferenced('goals', 'product1');
    expect(result).toBe(false);
  });

  it('should throw if product is referenced in any collection', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({ empty: false });

    await expect(firebaseProduct.delete('product1')).rejects.toThrow('REFERENCE_ERROR:goals');
  });

  it('should delete the product if not referenced', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ empty: true });
    (deleteDoc as jest.Mock).mockResolvedValue(undefined);

    await firebaseProduct.delete('product1');

    expect(deleteDoc).toHaveBeenCalled();
  });

  it('should search products by name', async () => {
    (collection as jest.Mock).mockReturnValue('mock-collection');
    (orderBy as jest.Mock).mockReturnValue('order-by');
    (startAt as jest.Mock).mockReturnValue('start-at');
    (endAt as jest.Mock).mockReturnValue('end-at');
    (query as jest.Mock).mockReturnValue('mock-query');
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        { id: '1', data: () => ({ name: 'Product A', unit_value: 10, cycle_days: 30 }) },
      ]
    });

    const result = await firebaseProduct.searchByName('Prod');

    expect(query).toHaveBeenCalledWith(
      'mock-collection',
      'order-by',
      'start-at',
      'end-at'
    );
    expect(orderBy).toHaveBeenCalledWith('name');
    expect(startAt).toHaveBeenCalledWith('Prod');
    expect(endAt).toHaveBeenCalledWith('Prod\u{f8ff}');

    expect(result).toEqual([
      { id: '1', name: 'Product A', unit_value: 10, cycle_days: 30 },
    ]);
  });
});
