const BaseController = require('./BaseController');

class UserController extends BaseController {
  
    constructor(userService){
        super(userService, "user")
    }

}

module.exports = UserController;