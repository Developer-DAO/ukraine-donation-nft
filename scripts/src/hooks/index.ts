import { Contract, providers, Wallet } from "ethers";
import {
  DEVELOPER_DAO_DERIVATIVES_UKRAINE_ADDRESS,
  POLYGON_RPC_URL,
} from "../constants";
import { DeveloperDaoDerivativesUkraine } from "../types/contracts";
import IDeveloperDaoDerivativesUkraine from "../abis/DeveloperDaoDerivativesUkraine.json";

export function useSigner() {
  const provider = new providers.JsonRpcProvider(POLYGON_RPC_URL);
  const signer = new Wallet(process.env.PRIVATE_KEY || "", provider);
  return signer;
}

export function useContracts() {
  const signer = useSigner();
  const derivativesContract = new Contract(
    DEVELOPER_DAO_DERIVATIVES_UKRAINE_ADDRESS,
    IDeveloperDaoDerivativesUkraine,
    signer
  ) as DeveloperDaoDerivativesUkraine;
  return { derivativesContract } as const;
}
