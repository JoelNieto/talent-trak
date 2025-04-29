import { PartialType } from '@nestjs/swagger';
import { CreateChargeConceptDto } from './create-charge-concept.dto';

export class UpdateChargeConceptDto extends PartialType(
  CreateChargeConceptDto
) {}
