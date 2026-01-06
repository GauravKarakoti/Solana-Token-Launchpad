import { createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";

export default function TokenLaunchpad() {
    const wallet = useWallet();
    const { connection } = useConnection();
    async function createToken() {
        const name =document.getElementById("name").value;
        const symbol =document.getElementById("symbol").value;
        const imageUrl =document.getElementById("imageUrl").value;
        const initialSupply =document.getElementById("initialSupply").value;
        const lamports = await getMinimumBalanceForRentExemptMint(connection);
        const keypair = Keypair.generate();

        // You create a new mint account
        // You first create a keypair for this new mint account
        // owners
        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: keypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID,   // who owns this account
            }),
            createInitializeMint2Instruction(keypair.publicKey, 6, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID),
        );
        const recentBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = recentBlockhash.blockhash;
        transaction.feePayer = wallet.publicKey;
        
        transaction.partialSign(keypair);
        let response = await wallet.sendTransaction(transaction, connection);
        console.log(response);
    }
    return <div style={{
        height: '60vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    }} className="launchpad">
        <h1 className="title">Solana Token Launchpad</h1>
        <input id="name" className='inputText' type="text" placeholder="Name"></input> <br />
        <input id="symbol" className='inputText' type="text" placeholder="Symbol"></input> <br />
        <input id="imageUrl" className='inputText' type="text" placeholder="Image URL"></input> <br />
        <input id="initialSupply" className='inputText' type="text" placeholder="Initial Supply"></input> <br />
        <button onClick={createToken} className='btn'>Create a Token</button>
    </div>;
}