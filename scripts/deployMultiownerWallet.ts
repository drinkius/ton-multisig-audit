import {Address, toNano} from '@ton/core';
import {Multisig} from '../wrappers/Multisig';
import {compile, NetworkProvider} from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    /*
    const multisig_code = await compile('Multisig');

    // deploy multisig

    const multiownerWallet = provider.open(Multisig.createFromConfig({
        threshold: 2,
        signers: [
            Address.parse('0QBxpznvBmM4dvno5Fp2VBuzE8Cn1y4JIF_8UUSQTu9GCUdK'), 
            Address.parse('0QArwTt1FGxQDrWDm7LPga76_9JRvXe1m5QsmVqhAvNby6YE'), 
            Address.parse('UQA1aCDHZRWP0UGA6PtJYd9ygQR7F32rsDcUt5yyXESZEfq8')
        ],
        proposers: [
            Address.parse('0QDdetVF40efFJLqYY6JlgFOZHjXcFIFLzNid-k6QxSmYg87')
        ],
        allowArbitrarySeqno: true
    }, multisig_code));

    await multiownerWallet.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(multiownerWallet.address);
    */
}
