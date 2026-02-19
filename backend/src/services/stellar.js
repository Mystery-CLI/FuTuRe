import * as StellarSDK from '@stellar/stellar-sdk';
import dotenv from 'dotenv';

dotenv.config();

const server = new StellarSDK.Horizon.Server(process.env.HORIZON_URL);
const isTestnet = process.env.STELLAR_NETWORK === 'testnet';

export async function createAccount() {
  const pair = StellarSDK.Keypair.random();
  
  if (isTestnet) {
    await fetch(`https://friendbot.stellar.org?addr=${pair.publicKey()}`);
  }
  
  return {
    publicKey: pair.publicKey(),
    secretKey: pair.secret()
  };
}

export async function getBalance(publicKey) {
  const account = await server.loadAccount(publicKey);
  return {
    publicKey,
    balances: account.balances.map(b => ({
      asset: b.asset_type === 'native' ? 'XLM' : `${b.asset_code}:${b.asset_issuer}`,
      balance: b.balance
    }))
  };
}

export async function sendPayment(sourceSecret, destination, amount, assetCode = 'XLM') {
  const sourceKeypair = StellarSDK.Keypair.fromSecret(sourceSecret);
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
  
  const asset = assetCode === 'XLM' 
    ? StellarSDK.Asset.native() 
    : new StellarSDK.Asset(assetCode, process.env.ASSET_ISSUER);
  
  const transaction = new StellarSDK.TransactionBuilder(sourceAccount, {
    fee: StellarSDK.BASE_FEE,
    networkPassphrase: isTestnet 
      ? StellarSDK.Networks.TESTNET 
      : StellarSDK.Networks.PUBLIC
  })
    .addOperation(StellarSDK.Operation.payment({
      destination,
      asset,
      amount: amount.toString()
    }))
    .setTimeout(30)
    .build();
  
  transaction.sign(sourceKeypair);
  const result = await server.submitTransaction(transaction);
  
  return {
    hash: result.hash,
    ledger: result.ledger,
    success: result.successful
  };
}

export async function getExchangeRate(from, to) {
  // Placeholder - integrate with price oracle or DEX
  return 1.0;
}
