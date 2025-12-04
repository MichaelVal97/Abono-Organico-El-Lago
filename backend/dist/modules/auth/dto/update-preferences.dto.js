"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePreferencesDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const user_preferences_entity_1 = require("../entities/user-preferences.entity");
class UpdatePreferencesDto {
    theme;
    language;
    emailNotifications;
    pushNotifications;
    newsletter;
}
exports.UpdatePreferencesDto = UpdatePreferencesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_preferences_entity_1.Theme, required: false }),
    (0, class_validator_1.IsEnum)(user_preferences_entity_1.Theme),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePreferencesDto.prototype, "theme", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_preferences_entity_1.Language, required: false }),
    (0, class_validator_1.IsEnum)(user_preferences_entity_1.Language),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePreferencesDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePreferencesDto.prototype, "emailNotifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePreferencesDto.prototype, "pushNotifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePreferencesDto.prototype, "newsletter", void 0);
//# sourceMappingURL=update-preferences.dto.js.map