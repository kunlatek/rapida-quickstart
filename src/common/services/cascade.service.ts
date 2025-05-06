import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class CascadeService {
  constructor(@InjectConnection() private readonly connection: any) { }

  async findCollectionsWithCreatedBy(): Promise<string[]> {
    const collections = await this.connection.db.listCollections().toArray();
    const collectionsWithCreatedBy: string[] = [];

    for (const collection of collections) {
      const model = this.connection.models[collection.name];
      if (model) {
        const schema = model.schema;
        if (schema.path('createdBy')) {
          collectionsWithCreatedBy.push(collection.name);
        }
      }
    }

    return collectionsWithCreatedBy;
  }

  async cascadeSoftDelete(userId: string): Promise<void> {
    const collections = await this.findCollectionsWithCreatedBy();

    for (const collectionName of collections) {
      const model = this.connection.models[collectionName];
      if (model) {
        await model.updateMany(
          { createdBy: userId },
          { $set: { deletedAt: new Date() } }
        );
      }
    }
  }

  async cascadeHardDelete(userId: string): Promise<void> {
    const collections = await this.findCollectionsWithCreatedBy();

    for (const collectionName of collections) {
      const model = this.connection.models[collectionName];
      if (model) {
        await model.deleteMany({ createdBy: userId });
      }
    }
  }

  async cascadeRestore(userId: string): Promise<void> {
    const collections = await this.findCollectionsWithCreatedBy();

    for (const collectionName of collections) {
      const model = this.connection.models[collectionName];
      if (model) {
        await model.updateMany(
          { createdBy: userId },
          { $unset: { deletedAt: 1 } }
        );
      }
    }
  }
} 