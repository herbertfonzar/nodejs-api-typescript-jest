import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import { ForecastController } from './controller/forecast';
import './util/module-alias';
import * as database from '@src/database'
import { BeachesController } from './controller/beaches';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupController();
    await this.setupDatabase()
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json())
  }

  private setupController(): void {
    const forecastController = new ForecastController()
    const beachesController = new BeachesController()
    this.addControllers([forecastController, beachesController])
  }

  private async setupDatabase(): Promise<void> {
    await database.connect()
  }

  public async close(): Promise<void> {
    await database.close()
  }

  public getApp(): Application {
    return this.app;
  }
}
