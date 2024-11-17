import { IsNotEmpty, IsString, IsArray, IsHexadecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNfttDto {
  @ApiProperty({ description: 'The address of the contract to interact with.' })
  @IsNotEmpty()
  @IsString()
  readonly contractAddress: string;

  @ApiProperty({ description: 'The arguments to pass to the contract method.' })
  @IsArray()
  readonly methodArgs: any[];

  @ApiProperty({ description: 'The private key used to sign the transaction.' })
  @IsNotEmpty()
  @IsString()
  @IsHexadecimal()
  readonly privateKey: string;
}
