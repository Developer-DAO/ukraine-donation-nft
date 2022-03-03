import axios from 'axios'
import PixelAvatarContract from '../../../../abis/PixelAvatars.json'
import {inject, unref} from 'vue'
import { PIXEL_AVATAR_TOKEN, SERVER_URL } from '../../constants'
import { ethers } from 'ethers'

export default function useContract() {
    const client = inject('web3client')

    return {
        async mint(variant) {
            const transaction = await client
                .contract(PIXEL_AVATAR_TOKEN, PixelAvatarContract.abi)
                .mintWithSignature(
                    null,
                    null,
                    null,
                    null,
                    null,
                    {
                        value: ethers.utils.parseEther(variant.price),
                    }
                )
                .catch(normalizeContractError)

            await transaction.wait().catch(normalizeContractError)
        },

        getOwnerOf(token) {
            return client
                .contract(PIXEL_AVATAR_TOKEN, PixelAvatarContract.abi)
                .ownerOf(token)
                .catch(() => null)
        },

        getTokenUri(token) {
            return client
                .contract(PIXEL_AVATAR_TOKEN, PixelAvatarContract.abi)
                .tokenURI(token)
                .catch(() => null)
        },
    }
}

function normalizeContractError(error) {
    throw new Error(
        null ??
            error?.error?.data?.originalError?.message ??
            error?.error?.message ??
            error?.data?.message ??
            error?.message
    )
}
