import { Controller } from "./common/Controller.js";
import { TesseractView } from "../view/tesseract/TesseractView.js";
import { EventBus } from "../EventBus.js";
import { getCroppingBox, applyCroppingBoxToCanvas } from "../common/ImageUtils.js";
import { Deferred } from "../common/Deferred.js";

const { createWorker, PSM, OEM } = require('tesseract.js');
const path = require("path");

const sTrainedData = path.join(__dirname, "./traineddata");

export class TesseractController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oTesseract = new TesseractView();
        const oTesseractContainer = this.createContainer("tesseract")
            .setContent(oTesseract);

        oTesseract.setParent(oTesseractContainer.getNode());

        this.deferred = new Deferred();

        EventBus.listen("tesseract-start", this.startRecognition, this);

        this._initTesseract();
    }

    _initTesseract () {
        this.worker = createWorker({
            cachePath: sTrainedData,
            logger: m => console.log(m),
            errorHandler: err => console.error(err)
        });

        return this.worker.load()
            .then(async () => {
                await this.worker.loadLanguage("eng");
                await this.worker.initialize("eng");
                await this.worker.setParameters({
                    tessedit_pageseg_mode: PSM.SINGLE_COLUMN,
                    tessedit_ocr_engine_mode: OEM.LSTM_ONLY,
                    tessedit_char_whitelist: "0123456789,"
                });
            })
            .then(this.deferred.resolve)
            .catch(this.deferred.reject);
    }

    startRecognition (oImage, oSelection) {
        const aCroppingBox = getCroppingBox(oImage, oSelection);
        const oCanvas = this.getContainerContent("tesseract").getCanvas();
        applyCroppingBoxToCanvas(oCanvas, oImage, ...aCroppingBox);
        const sData = oCanvas.toDataURL();

        this.deferred.promise
            .then(() => {
                return this.worker.recognize(sData);
            })
            .then(oData => {
                const aResult = oData.data.lines.map(oItem => {
                    const sText = oItem.text
                        .replace(/\n/g, "")
                        .replace(/ /g, "")
                        .replace(/,/g, "");
                    return parseInt(sText, 10) / 100;
                });
                EventBus.sendToCurrentWindow("tesseract-result", aResult);
            });
    }
}
