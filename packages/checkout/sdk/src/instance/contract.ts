import { Contract, Interface, Signer, Provider } from "ethers";

export function getTokenContract(
  address: string,
  contractInterface: Interface,
  signerOrProvider: Provider | Signer | undefined
) {
  return new Contract(address, contractInterface, signerOrProvider);
}
