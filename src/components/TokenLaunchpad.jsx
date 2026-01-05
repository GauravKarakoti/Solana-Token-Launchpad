import { createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";

export default function TokenLaunchpad() {
    const wallet = useWallet();
    async function createToken() {
        const lamports = await getMinimumBalanceForRentExemptMint(connection);
        const keypair = Keypair.generate();

        // You create a new mint account
        // You first create a keypair for this new mint account
        // owners
        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: payer.publicKey,
                newAccountPubkey: keypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId,   // who owns this account
            }),
            createInitializeMint2Instruction(keypair.publicKey, decimals, mintAuthority, freezeAuthority, programId),
        );
        
        transaction.partialSign(keypair);
        await wallet.signTransaction(transaction);
    }
    return <div style={{
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    }} className="launchpad">
        <h1 className="title">Solana Token Launchpad</h1>
        <input className='inputText' type="text" placeholder="Name"></input> <br />
        <input className='inputText' type="text" placeholder="Symbol"></input> <br />
        <input className='inputText' type="text" placeholder="Image URL"></input> <br />
        <input className='inputText' type="text" placeholder="Initial Supply"></input> <br />
        <button onClick={createToken} className='btn'>Create a Token</button>
    </div>;
}