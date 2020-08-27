import { Controller } from "./common/Controller.js";
import { TesseractView } from "../view/tesseract/TesseractView.js";
import { EventBus } from "../EventBus.js";
import { getCroppingBox, applyCroppingBoxToCanvas } from "../common/ImageUtils.js";

export class TesseractController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oTesseract = new TesseractView();
        const oTesseractContainer = this.createContainer("tesseract")
            .setContent(oTesseract);

        oTesseract.setParent(oTesseractContainer.getNode());

        EventBus.listen("tesseract-start", this.startRecognition, this);
    }

    _initTesseract () {

    }

    startRecognition (oImage, oSelection) {
        const aCroppingBox = getCroppingBox(oImage, oSelection);
        const oCanvas = this.getContainerContent("tesseract").getCanvas();
        applyCroppingBoxToCanvas(oCanvas, oImage, ...aCroppingBox);
    }
}
