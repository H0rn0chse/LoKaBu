import { DetailSection } from './detail/DetailSection.js';

export class SectionContainer {
    constructor (oParentNode) {
        this.aSections = [
            new DetailSection(oParentNode)
        ];
    }
}
