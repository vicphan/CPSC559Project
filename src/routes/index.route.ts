import { Router } from 'express';
import IndexController from '../controllers/index.controller';
import { Routes } from '../interfaces/routes.interface';

class IndexRoute implements Routes {
  public path = '/';
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.indexController.index);
    this.router.get(`${this.path}resetQuestions`, this.indexController.resetQuestions);
    this.router.post(`${this.path}removeProxy`, this.indexController.removeProxy);
    this.router.get(`${this.path}ping`, this.indexController.ping);
    this.router.get(`${this.path}clearTob`, this.indexController.clearAllTob);
  }
}

export default IndexRoute;
