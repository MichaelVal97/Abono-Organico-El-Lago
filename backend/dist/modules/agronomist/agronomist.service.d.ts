import { AnalyzePlantResponseDto } from './dto/analyze-plant-response.dto';
export declare class AgronomistService {
    private genAI;
    constructor();
    analyzePlant(files: Express.Multer.File[]): Promise<AnalyzePlantResponseDto>;
}
