import { ProductRepository } from '@domain/repositories/ProductRepository';
import {
  addDoc, collection, deleteDoc, doc,
  endAt, getDocs, limit, orderBy, query,
  startAt, updateDoc,
  where,
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

  async update(product: Product): Promise<Product> {
    await updateDoc(doc(firestore, 'products', product.id), {
      name: product.name,
      unit_value: product.unit_value,
      cycle_days: product.cycle_days,
    });

    return product;
  }

  async isProductReferenced(collectionName: string, productId: string): Promise<boolean> {
    const ref = collection(firestore, collectionName);
    const q = query(ref, where('product_id', '==', doc(firestore, 'products', productId)), limit(1));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  async delete(id: string): Promise<void> {
    const collectionsToCheck = ['goals', 'inventory', 'kardex', 'sales'];

    for (const col of collectionsToCheck) {
      const referenced = await this.isProductReferenced(col, id);
      if (referenced) {
        throw new Error(`REFERENCE_ERROR:${col}`);
      }
    }

    return await deleteDoc(doc(firestore, 'products', id));
  }

  async searchByName(searchText: string): Promise<Product[]> {
     const producsQuery = query(
      collection(firestore, 'products'),
      orderBy('name'),
      startAt(searchText),
      endAt(searchText + '\uf8ff')
    );

    const snapshot = await getDocs(producsQuery);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Product));

    return products;
  }
};

export const firebaseProduct = new FirebaseProduct();
