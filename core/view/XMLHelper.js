/**
 * Creates a tree of components based on the xml text
 * The componets get already instantiated
 */

const { readFile } = require('fs').promises;
const path = require("path");

const sBasePath = "D:\\Aaron\\Dokumente\\#InformatikProjekte\\LoKaBu\\repo";

class _XmlHelper {
    constructor () {
        this.parser = new DOMParser();
    }

    async loadView (sPath) {
        const sViewPath = `${sPath}.view.xml`;
        const xmlDoc = await this.loadFile(sViewPath);
        return xmlDoc.children[0];
    }

    async loadFragment (sPath) {
        const sFragmentPath = `${sPath}.fragment.xml`;
        const xmlDoc = await this.loadFile(sFragmentPath);
        return xmlDoc.children[0];
    }

    async loadFile (sPath) {
        const sFilePath = path.join(sBasePath, sPath);
        const sXml = await readFile(sFilePath, "utf-8");
        return this.parser.parseFromString(sXml, "text/xml");
    }

    parse (xmlDoc, root) {
        return this.parseNode(xmlDoc, root);
    }

    /**
     * Recursively iterates through the XMLTree and instantiates the components
     * @param {*} xmlNode
     * @param {*} parentComponent
     */
    async parseNode (xmlNode, parentComponent) {
        let node;
        const oAttributes = this.propertiesToObject(xmlNode);
        const sModulePath = `../../${xmlNode.namespaceURI}/${xmlNode.localName}.js`;
        const oModule = await import(sModulePath);

        if (oAttributes.templateId) {
            const sTemplateId = oAttributes.templateId;
            delete oAttributes.templateId;
            parentComponent.addTemplate(sTemplateId, oModule[xmlNode.localName], oAttributes);
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
    propertiesToObject (xmlNode) {
        const attributes = {};
        Array.from(xmlNode.attributes).forEach(attribute => {
            if (attribute.name.startsWith("xmlns")) {
                return;
            }
            attributes[attribute.name] = attribute.value;
        });
        return attributes;
    }
};

export const XmlHelper = new _XmlHelper();
