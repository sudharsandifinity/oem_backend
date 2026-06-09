const DraftService = require('../../services/SapServices/DraftService');
const SapDocumentController = require("./SapDocumentController");
const { createAttachment } = require("../SAPController");
const sapObjectTypes = require("../../utils/sapObjectTypes")

class DraftController extends SapDocumentController {

    constructor() {
        super(new DraftService());
    }

    getDocObjectCode = (docModule) => {
        const objectType = sapObjectTypes[docModule];
        if (!objectType) {
            throw new Error(`Unsupported DocModule: ${docModule}`);
        }
        return objectType.toString();
    }

    create = async (req, res) => {
        try {
            const {
                DocModule,
                DocumentLines,
                DocumentAdditionalExpenses,
                ...sapData
            } = req.body;

            const payload = {
                ...sapData,
                DocObjectCode: this.getDocObjectCode(DocModule),
                BPL_IDAssignedToInvoice: "1",
                DocumentLines: this.parse(DocumentLines),
                DocumentAdditionalExpenses: this.parse(DocumentAdditionalExpenses)
            };

            const attachments = await this.handleAttachment(req);

            if (attachments) {
                payload.AttachmentEntry = attachments.AbsoluteEntry;
            }

            const response = await this.service.create(req, payload);

            return res.status(201).json({
                message: "Created successfully",
                data: response
            });

        } catch (error) {
            return this.errorCatch(res, res, 'Error while creating record', error);
        }
    };

    update = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                DocumentLines,
                DocumentAdditionalExpenses,
                ...sapData
            } = req.body;

            sapData.BPL_IDAssignedToInvoice = "1";

            const existingDocument = await this.service.getById(req, id);

            if (!existingDocument) {
                return res.status(404).json({
                    message: `Document ${id} not found`
                });
            }

            const payload = {
                ...sapData,
                DocumentLines: this.parse(DocumentLines),
                DocumentAdditionalExpenses: this.parse(DocumentAdditionalExpenses)
            };

            const response = await this.service.patch(req, id, payload);

            return res.status(200).json({
                message: "Updated successfully",
                data: response
            });

        } catch (error) {
            return this.errorCatch(req, res, "Error while updating record", error);
        }
    };

    parse(value) {
        if (!value) return [];
        if (typeof value === "string") {
            try {
                return JSON.parse(value);
            } catch {
                return [];
            }
        }
        return value;
    }

    async handleAttachment(req) {
        if (!req.files?.length) return null;
        return await createAttachment(req);
    }

}

module.exports = DraftController;