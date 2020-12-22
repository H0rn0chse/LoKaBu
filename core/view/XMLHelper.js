/**
 * Creates a tree of components based on the xml text
 * The componets get already instantiated
 */

const { readFile } = require('fs').promises;
const path = require("path");

const sBasePath = "D:\\Aaron\\Dokumente\\#InformatikProjekte\\LoKaBu\\repo";

class _XMLHelper {
    constructor () {
        this.parser = new DOMParser();
    }

    async loadFragment (sPath) {
        const sFragmentPath = path.join(sBasePath, `${sPath}.fragment.xml`);
        const sXml = await readFile(sFragmentPath, "utf-8");
        const xmlDoc = this.parser.parseFromString(sXml, "text/xml");
        const oView = xmlDoc.children[0];
        return oView;
    }

    parse (oView, root) {
        return this.parseNode(oView, root);
    }

    /**
     * Recursively iterates through the XMLTree and instantiates the components
     * @param {*} xmlNode
     * @param {*} parentComponent
     */
    async parseNode (xmlNode, parentComponent) {
        let node;
        const oAttributes = this._propertiesToObject(xmlNode);
        const sModulePath = `../../${xmlNode.namespaceURI}/${xmlNode.localName}.js`;
        const oModule = await import(sModulePath);

        if (oAttributes.templateId) {
            parentComponent.addTemplate(oAttributes.templateId, oModule, oAttributes);
        } else {
            node = new oModule[xmlNode.localName](oAttributes);
            node.setParentComponent(parentComponent);
        }

        if (xmlNode && xmlNode.children && xmlNode.children.length > 0) {
            return Promise.all(Array.from(xmlNode.children).map(childNode => {
                return this.parseNode(childNode, node);
            }));
        }
        return node;
    }

    /**
     * Converts the Node properties to an object
     * @param {*} xmlNode
     */
    _propertiesToObject (xmlNode) {
        const attributes = {};
        Array.from(xmlNode.attributes).forEach(attribute => {
            attributes[attribute.name] = attribute.value;
        });
        return attributes;
    }
};

export const XMLHelper = new _XMLHelper();
