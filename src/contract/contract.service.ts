import { Injectable } from '@nestjs/common';
import { ethers, Wallet, ContractFactory } from 'ethers';
import { AdminService } from '../cockroach/admin.service';
import { DeployCertificateDto } from './dto/deploy.dto';
import { WriteContractDto } from './dto/write.dto';
import { CreateNfttDto } from './dto/create.dto';
import { VerifyCertificateDto } from './dto/verify.dto';
import * as contractAbi from '../abi/abi.json';

@Injectable()
export class ContractService {
  private provider: ethers.JsonRpcProvider;
  private baseURI = process.env.GATE_URL;
  private scanUrl = process.env.SCAN_URL;
  constructor(private readonly adminService: AdminService) {
    const providerUrl = process.env.PROVIDER_URL;
    this.provider = new ethers.JsonRpcProvider(providerUrl);
  }

  async deployCertificate(deployDto: DeployCertificateDto): Promise<string> {
    const { certificateName, certificateSymbol, privateKey } = deployDto;
    const { abi, bytecode } = contractAbi;

    try {
      const wallet = new Wallet(privateKey, this.provider);
      const factory = new ContractFactory(abi, bytecode, wallet);
      const admins = await this.adminService.findAllAddresses();

      console.log(admins);

      const contract = await factory.deploy(
        certificateName,
        certificateSymbol,
        this.baseURI,
      );

      await contract.waitForDeployment();

      const contractAddress = await contract.getAddress();

      await this.writeContract({
        contractAddress,
        methodName: 'mintWithMetadata',
        methodArgs: [await wallet.getAddress(), 0, ''],
        privateKey,
      });

      await this.addOperator(contractAddress, admins, privateKey);

      console.log(`Contract deployed at address: ${contractAddress}`);

      const contractUrl = `${this.scanUrl}/address/${contractAddress}`;

      return contractUrl;
    } catch (error) {
      console.error('Error deploying contract:', error);
      throw error;
    }
  }

  async readContract(
    contractAddress: string,
    methodName: string,
    methodArgs: any[] = [],
  ): Promise<any> {
    const { abi } = contractAbi;
    try {
      const contract = new ethers.Contract(contractAddress, abi, this.provider);
      const result = await contract[methodName](...methodArgs);
      console.log(`Result from ${methodName}:`, result);
      return result;
    } catch (error) {
      console.error(`Error reading from contract method ${methodName}:`, error);
      throw error;
    }
  }

  async writeContract(writeContractDto: WriteContractDto): Promise<string> {
    const { abi } = contractAbi;
    try {
      const wallet = new Wallet(writeContractDto.privateKey, this.provider);
      const contract = new ethers.Contract(
        writeContractDto.contractAddress,
        abi,
        wallet,
      );

      const tx = await contract[writeContractDto.methodName](
        ...writeContractDto.methodArgs,
      );

      console.log(`Transaction sent: ${tx.hash}`);

      const receipt = await tx.wait();

      return receipt.hash;
    } catch (error) {
      console.error(
        `Error writing to contract method ${writeContractDto.methodName}:`,
        error,
      );
      throw error;
    }
  }

  async addOperator(
    contractAddress: string,
    operators: string[],
    privateKey: string,
  ): Promise<string> {
    try {
      for (const operator of operators) {
        await this.writeContract({
          contractAddress: contractAddress,
          methodName: 'addOperator',
          methodArgs: [operator],
          privateKey: privateKey,
        });
      }
    } catch (error) {
      console.error(
        `Error add operator to contract ${contractAddress}:`,
        error,
      );
      throw error;
    }
    return null;
  }

  async createNft(createNfttDto: CreateNfttDto): Promise<string> {
    try {
      await this.writeContract({
        contractAddress: createNfttDto.contractAddress,
        methodName: 'mintWithMetadata',
        methodArgs: createNfttDto.methodArgs,
        privateKey: createNfttDto.privateKey,
      });

      const nftUrl = `${this.scanUrl}/token/${createNfttDto.contractAddress}/instance/${createNfttDto.methodArgs[1]}`;

      return nftUrl;
    } catch (error) {
      console.error(
        `Error create nft to contract ${createNfttDto.contractAddress}:`,
        error,
      );
      throw error;
    }
  }

  async verifyCertificate(
    verifyCertificateDto: VerifyCertificateDto,
  ): Promise<string> {
    try {
      const result = await this.writeContract({
        contractAddress: verifyCertificateDto.contractAddress,
        methodName: 'verify',
        methodArgs: [verifyCertificateDto.id],
        privateKey: verifyCertificateDto.privateKey,
      });

      const txhashUrl = `${this.scanUrl}/tx/${result}`;

      return txhashUrl;
    } catch (error) {
      console.error(
        `Error verify certificate to contract ${verifyCertificateDto.contractAddress}:`,
        error,
      );
      throw error;
    }
  }

  async getVerifiersCertificate(address: string, id: number): Promise<any> {
    try {
      const listVerifiers = await this.readContract(address, 'getVerifiers', [
        id,
      ]);
      const admins = await this.adminService.findAll();
      const result = [];
      let verifiedCount: number = 0;

      for (const admin of admins) {
        if (admin.address && listVerifiers.includes(admin.address)) {
          result.push({
            name: admin.name,
            address: admin.address,
            verified: true,
          });
          verifiedCount++;
        } else {
          result.push({
            name: admin.name,
            address: admin.address,
            verified: false,
          });
        }
      }

      return { result, verifiedCount };
    } catch (error) {
      console.error(
        `Error get verifiers certificate to contract ${address}:`,
        error,
      );
      throw error;
    }
  }

  async getNftTotalSupply(contractAddress: string) {
    const totalSupply = await this.readContract(
      contractAddress,
      'totalSupply',
      [],
    );

    return totalSupply;
  }

  async getBaseUri(contractAddress: string, id: number) {
    const tokenUri = await this.readContract(contractAddress, 'tokenURI', [id]);

    return tokenUri;
  }

  async getIsVerifiedCertificate(
    contractAddress: string,
    verifer: string,
    id: number,
  ) {
    const tokenUri = await this.readContract(contractAddress, 'isVerify', [
      verifer,
      id,
    ]);

    return tokenUri;
  }

  async getBaseUris(
    contractAddresses: string,
    ids: number[],
  ): Promise<string[]> {
    const baseUris: string[] = [];

    for (let i = 0; i < ids.length; i++) {
      try {
        const uri = await this.getBaseUri(contractAddresses, ids[i]);
        baseUris.push(uri);
      } catch (error) {
        console.error(
          `Failed to fetch base URI for contract ${contractAddresses} and ID ${ids[i]}:`,
          error,
        );
        baseUris.push(null);
      }
    }

    return baseUris;
  }
}
