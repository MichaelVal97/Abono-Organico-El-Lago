import { AnalyzePlantResponseDto } from './dto/analyze-plant-response.dto';
export declare class AgronomistService {
    analyzePlant(files: Express.Multer.File[]): Promise<AnalyzePlantResponseDto>;
}
