import BaseController from './web/controllers/base.controller';
import Server from './web/server';

import todoController from './web/controllers/todo.controller';
import viewController from './web/controllers/view.controller';

const controllers: BaseController[] = [todoController, viewController];

const server = new Server(controllers);

server
  .configure()
  .then(() => server.start())
  .catch((error) => console.log(error));
