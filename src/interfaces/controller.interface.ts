import { Router } from "express";

/**
 * Represents a controller for handling routes.
 */
interface Controller {
  /**
   * The base path for the routes handled by this controller.
   */
  path: string;
  /**
   * The Express router used to define routes for this controller.
   */
  router: Router;
}

export default Controller;