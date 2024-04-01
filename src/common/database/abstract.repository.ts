import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.entity';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export abstract class AbstractRepository<T extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(private readonly model: Model<T>) {}

  async create(document: Omit<T, '_id'>): Promise<T> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as T;
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<T> {
    const document = (await this.model.findOne(
      filterQuery,
      {},
      { lean: true },
    )) as T;

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async find(filterQuery: FilterQuery<T>): Promise<T[]> {
    return (await this.model.find(filterQuery, {}, { lean: true })) as T[];
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updates: UpdateQuery<T>,
  ): Promise<T> {
    const document = (await this.model.findOneAndUpdate(filterQuery, updates, {
      lean: true,
      new: true,
    })) as T;

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T> {
    const document = (await this.model.findOneAndDelete(filterQuery, {
      lean: true,
    })) as T;

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }
}
