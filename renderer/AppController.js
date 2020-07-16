import { HeaderController } from "./controller/header/HeaderController.js";
import { Controller } from "./controller/common/Controller.js";

export class AppController extends Controller {
    constructor (oDomRef) {
        super();
        this.node = oDomRef;

        this.header = new HeaderController(this.node);
    }
};
