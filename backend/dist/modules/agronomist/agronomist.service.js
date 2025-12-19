"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgronomistService = void 0;
const common_1 = require("@nestjs/common");
const plant_analysis_1 = require("../../../ai/plant-analysis");
let AgronomistService = class AgronomistService {
    async analyzePlant(files) {
        if (!files || files.length === 0) {
            throw new Error('No images provided');
        }
        const images = files.map(file => {
            const base64 = file.buffer.toString('base64');
            return `data:${file.mimetype};base64,${base64}`;
        });
        const analysis = await (0, plant_analysis_1.analyzePlantFlow)({ images });
        return analysis;
    }
};
exports.AgronomistService = AgronomistService;
exports.AgronomistService = AgronomistService = __decorate([
    (0, common_1.Injectable)()
], AgronomistService);
//# sourceMappingURL=agronomist.service.js.map