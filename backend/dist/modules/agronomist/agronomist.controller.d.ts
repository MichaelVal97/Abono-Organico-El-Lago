import { AgronomistService } from './agronomist.service';
export declare class AgronomistController {
    private readonly agronomistService;
    constructor(agronomistService: AgronomistService);
    analyzePlant(files: Express.Multer.File[]): Promise<import("./dto/analyze-plant-response.dto").AnalyzePlantResponseDto>;
}
