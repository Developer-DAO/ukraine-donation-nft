import "dotenv/config";
import { useContracts, useSigner } from "./hooks";

async function main() {
  const { derivativesContract } = useContracts();

  await derivativesContract.withdraw()
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
