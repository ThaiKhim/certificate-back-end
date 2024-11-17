import { Injectable } from '@nestjs/common';
import { ethers, Wallet, ContractFactory } from 'ethers';
import { DeployCertificateDto } from './dto/deploy.dto';
import * as contractAbi from '../abi/abi.json';

@Injectable()
export class ContractService {
  private provider: ethers.JsonRpcProvider;
  private baseURI = 'https://amber-parallel-falcon-815.mypinata.cloud';

  constructor() {
    const providerUrl = 'http://207.244.229.251:8549/';
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

      await this.writeContract(
        contractAddress,
        'mintWithMetadata',
        [await wallet.getAddress(), 0, ''],
        privateKey,
      );

      console.log(`Contract deployed at address: ${contractAddress}`);

      return contractAddress;
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

  async writeContract(
    contractAddress: string,
    methodName: string,
    methodArgs: any[],
    privateKey: string,
  ): Promise<string> {
    const { abi } = contractAbi;
    try {
      const wallet = new Wallet(privateKey, this.provider);
      const contract = new ethers.Contract(contractAddress, abi, wallet);

      const tx = await contract[methodName](...methodArgs);

      console.log(`Transaction sent: ${tx.hash}`);

      const receipt = await tx.wait();

      console.log(`Transaction confirmed: ${receipt.transactionHash}`);

      return receipt.transactionHash;
    } catch (error) {
      console.error(`Error writing to contract method ${methodName}:`, error);
      throw error;
    }
  }
}
