import { Address } from '@graphprotocol/graph-ts';
import { User } from '../generated/schema';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export function createUser(address: Address): void {
  let user = User.load(address.toHexString())

  if (user === null && address.toHexString() != ADDRESS_ZERO) {
    user = new User(address.toHexString())
    user.save()
  }
}
