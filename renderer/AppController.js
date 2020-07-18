import { HeaderController } from "./controller/header/HeaderController.js";
import { Controller } from "./controller/common/Controller.js";

export class AppController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oHeader = this.createContainer("header");
        oHeader.setContent(new HeaderController(oHeader.getNode()));
    }

    start () {
        this.getContainer("header").getContent().update();
    }
};
