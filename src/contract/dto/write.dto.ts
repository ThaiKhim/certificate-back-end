import { IsNotEmpty, IsString, IsArray, IsHexadecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WriteContractDto {
  @ApiProperty({ description: 'The address of the contract to interact with.' })
  @IsNotEmpty()
  @IsString()
  readonly contractAddress: string;

  @ApiProperty({ description: 'The method name to call on the contract.' })
  @IsNotEmpty()
  @IsString()
  readonly methodName: string;

  @ApiProperty({ description: 'The arguments to pass to the contract method.' })
  @IsArray()
  readonly methodArgs: any[];

  @ApiProperty({ description: 'The private key used to sign the transaction.' })
  @IsNotEmpty()
  @IsString()
  @IsHexadecimal()
  readonly privateKey: string;
}
