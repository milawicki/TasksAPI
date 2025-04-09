import { IsString, IsUUID, IsRFC3339, IsNotEmpty, Validate, MaxLength } from 'class-validator';

import { UUID, Timestamp } from 'src/common/types';
import { IsAfterConstraint } from 'src/common/validators';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsRFC3339()
  starts_at: Timestamp;

  @IsRFC3339()
  @Validate(IsAfterConstraint, ['starts_at'])
  ends_at: Timestamp;

  @IsUUID('4')
  user_id: UUID;
}
