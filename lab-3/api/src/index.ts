import BaseController from './web/controllers/base.controller';
import Server from './web/server';

import todoController from './web/controllers/todo.controller';
import userController from './web/controllers/user.controller';

const controllers: BaseController[] = [todoController, userController];

const server = new Server(controllers);

server
  .configure()
  .then(() => server.start())
  .catch((error) => console.log(error));
