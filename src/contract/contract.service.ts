import { Injectable } from '@nestjs/common';
import { ethers, Wallet, ContractFactory } from 'ethers';
import { DeployCertificateDto } from './dto/deploy.dto';
import { WriteContractDto } from './dto/write.dto';
import { CreateNfttDto } from './dto/create.dto';
import * as contractAbi from '../abi/abi.json';

@Injectable()
export class ContractService {
  private provider: ethers.JsonRpcProvider;
  private baseURI = 'https://amber-parallel-falcon-815.mypinata.cloud/ipfs/';
  private scanUrl = 'http://34.81.113.222';
  constructor() {
    const providerUrl = 'http://34.81.113.222:8549/';
    this.provider = new ethers.JsonRpcProvider(providerUrl);
  }

  async deployCertificate(deployDto: DeployCertificateDto): Promise<string> {
    const { certificateName, certificateSymbol, privateKey } = deployDto;
    const { abi, bytecode } = contractAbi;

    try {
      const wallet = new Wallet(privateKey, this.provider);
      const factory = new ContractFactory(abi, bytecode, wallet);

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

      return receipt.transactionHash;
    } catch (error) {
      console.error(
        `Error writing to contract method ${writeContractDto.methodName}:`,
        error,
      );
      throw error;
    }
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

  async getNftTotalSupply(contractAddress: string) {
    const totalSupply = await this.readContract(
      contractAddress,
      'totalSupply',
      [],
    );

    return totalSupply;
  }
}
