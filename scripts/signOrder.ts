import {Address, beginCell, toNano} from '@ton/core';
import {Order} from '../wrappers/Order';
import {promptInt, promptCell, promptToncoin, promptUserFriendlyAddress} from "../wrappers/ui-utils";
import {compile, NetworkProvider} from '@ton/blueprint';
import {getSignerIndex} from "./MultisigChecker";

export async function run(provider: NetworkProvider) {

    const isTestnet = provider.network() !== 'mainnet';

    const ui = provider.ui();

    const orderCode = await compile('Order');


    const orderAddress = await promptUserFriendlyAddress('Enter order address', ui, isTestnet);
    const orderContract = provider.open(Order.createFromAddress(orderAddress.address));

    const signerIndex = await promptInt("Enter signer index", ui);

    // const multisigAddress = await promptUserFriendlyAddress('Enter multisig address', ui, isTestnet);
    // const multisigContract = provider.open(Order.createFromAddress(multisigAddress.address)); 

    try {

        await orderContract.sendApprove(
            provider.sender(),
            signerIndex
        );


    } catch (e: any) {
        ui.write(e.message);
        return;
    }
}
