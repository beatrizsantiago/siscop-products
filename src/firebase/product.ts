import { ProductRepository } from '@domain/repositories/ProductRepository';
import {
  addDoc, collection, deleteDoc, doc, getDocs, query,
} from 'firebase/firestore';
import Product from '@domain/entities/Product';

import { firestore } from './config';

class FirebaseProduct implements ProductRepository {
  async add(product: Product): Promise<Product> {
    const response = await addDoc(collection(firestore, 'products'), {
      name: product.name,
      unit_value: product.unit_value,
      cycle_days: product.cycle_days,
    });

    const newProduct = {
      ...product,
      id: response.id,
    };

    return newProduct;
  }

  async getAll(): Promise<Product[]> {
    const producsQuery = query(collection(firestore, 'products'));
    const snapshot = await getDocs(producsQuery);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Product));

    return products;
  }

  async delete(id: string): Promise<void> {
    return await deleteDoc(doc(firestore, 'products', id));
  }
};

export const firebaseProduct = new FirebaseProduct();
