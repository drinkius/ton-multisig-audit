import {toNano,Address} from '@ton/core';
import {Multisig} from '../wrappers/Multisig';
import {compile, NetworkProvider} from '@ton/blueprint';
import {explorerUrl, promptBool, promptInt, promptUserFriendlyAddress} from '../wrappers/ui-utils';

export async function run(provider: NetworkProvider) {
    const isTestnet = provider.network() !== 'mainnet';

    const ui = provider.ui();
    ui.write('Creating a multisig..');
    const multisigCode = await compile('Multisig');

    const signersCount = 3//await promptInt('Signers can create orders and sign it for execution.\nEnter signers count:', ui, 1, 255);
    const threshold = 2//await promptInt(`Enter the number of signatures required for order execution (1-${signersCount}):`, ui, 1, signersCount);
    const proposersCount = 1//await promptInt('Proposers can ONLY create orders but can NOT sign it.\nEnter proposers count (0 if there are no proposers):', ui, 0, 255);

    const signers = [
        Address.parseFriendly("UQA1aCDHZRWP0UGA6PtJYd9ygQR7F32rsDcUt5yyXESZEfq8"),
        Address.parseFriendly("0QArwTt1FGxQDrWDm7LPga76_9JRvXe1m5QsmVqhAvNby6YE"),
        Address.parseFriendly("0QBxpznvBmM4dvno5Fp2VBuzE8Cn1y4JIF_8UUSQTu9GCUdK"),
    ];
    // for (let i = 0; i < signersCount; i++) {
    //     signers.push(await promptUserFriendlyAddress(`Enter signer #${i} address`, ui, isTestnet));
    // }
    const proposers = [
        Address.parseFriendly("0QDdetVF40efFJLqYY6JlgFOZHjXcFIFLzNid-k6QxSmYg87"),
    ];
    // for (let i = 0; i < proposersCount; i++) {
    //     proposers.push(await promptUserFriendlyAddress(`Enter proposer #${i} address`, ui, isTestnet));
    // }
    const allowArbitraryOrderSeqno = true// !(await promptBool('When creating a new order, you will need to specify its ID.\nShould order IDs be sequential?:', ['y', 'n'], ui));

    ui.write("----------------------------------");
    ui.write("Multisig");
    ui.write(`${signers.length} signers:`);
    for (let i = 0; i < signers.length; i++) {
        const signer = signers[i];
        const addressString = signer.address.toString({
            bounceable: signer.isBounceable,
            testOnly: isTestnet
        });
        ui.write(`#${i} - ${addressString} - ${explorerUrl(addressString, isTestnet)}`);
    }
    ui.write(`Quorum: ${threshold} of ${signers.length}`);
    ui.write(proposers.length > 0 ? `${proposers.length} proposers:` : 'No proposers');
    for (let i = 0; i < proposers.length; i++) {
        const proposer = proposers[i];
        const addressString = proposer.address.toString({
            bounceable: proposer.isBounceable,
            testOnly: isTestnet
        });
        ui.write(`#${i} - ${addressString} - ${explorerUrl(addressString, isTestnet)}`);
    }
    ui.write((allowArbitraryOrderSeqno ? 'Arbitrary' : 'Sequential') + ' order IDs');

    if (!(await promptBool('Confirm and deploy', ['y', 'n'], ui))) {
        ui.write('Please start over');
        return;
    }

    // deploy

    const multisig = provider.open(Multisig.createFromConfig({
        threshold: threshold,
        signers: signers.map(x => x.address),
        proposers: proposers.map(x => x.address),
        allowArbitrarySeqno: allowArbitraryOrderSeqno
    }, multisigCode));

    await multisig.sendDeploy(provider.sender(), toNano('0.05'));
    console.log("Expected address: " + multisig.address)
    // await provider.waitForDeploy(multisig.address);
}