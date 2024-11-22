import { IsNotEmpty, IsString, IsHexadecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyCertificateDto {
  @ApiProperty({ description: 'The address of the contract to interact with.' })
  @IsNotEmpty()
  @IsString()
  readonly contractAddress: string;

  @ApiProperty({ description: 'The id to pass to the verify method.' })
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @ApiProperty({ description: 'The private key used to sign the transaction.' })
  @IsNotEmpty()
  @IsString()
  @IsHexadecimal()
  readonly privateKey: string;
}
