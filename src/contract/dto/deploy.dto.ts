import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeployCertificateDto {
  @ApiProperty({ description: 'The name of the certificate.' })
  @IsNotEmpty()
  @MaxLength(255)
  readonly certificateName: string;

  @ApiProperty({ description: 'The symbol of the certificate.' })
  @IsNotEmpty()
  @MaxLength(10)
  readonly certificateSymbol: string;

  @ApiProperty({ description: 'The private key for the certificate.' })
  @IsNotEmpty()
  @MaxLength(255)
  readonly privateKey: string;
}
