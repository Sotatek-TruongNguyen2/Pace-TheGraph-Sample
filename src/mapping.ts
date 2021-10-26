import { BigInt } from "@graphprotocol/graph-ts"
import {
  CollectionDeployed,
  CollectionExchangeSettled,
  CollectionRegistrySettled,
  OwnershipTransferred,
} from "../generated/PaceArtFactory/PaceArtFactory"
import {
  Transfer,
  PaceArtStore
} from "../generated/templates/Collection/PaceArtStore";

import { Collectible, Collection } from "../generated/schema"
import { Collection as CollectionTemplate } from "../generated/templates"
import { createUser } from './helpers';

export function handleCollectionDeployed(event: CollectionDeployed): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = Collection.load(event.params.collection.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new Collection(event.params.collection.toHex());

    entity.owner = event.params.creator;
    entity.createdAtTimestamp = event.block.timestamp
    entity.createdAtBlockNumber = event.block.number
  }
  
  CollectionTemplate.create(event.params.collection);

  entity.save()
}

export function handleCollectionExchangeSettled(
  event: CollectionExchangeSettled
): void {}

export function handleCollectionRegistrySettled(
  event: CollectionRegistrySettled
): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleTransfer(event: Transfer): void {
  let from = event.params.from;
  createUser(from);
  let to = event.params.to; 
  createUser(to);

  let collectionContract = PaceArtStore.bind(event.address);
  let collectible = Collectible.load(event.params.tokenId.toString() + "-" + event.address.toHex());

  if (!collectible) {
    collectible = new Collectible(event.params.tokenId.toString() + "-" + event.address.toHex());
  }

  collectible.timestamp = event.block.timestamp;
  collectible.tokenID = event.params.tokenId;
  collectible.metadataURI = collectionContract.tokenURI(event.params.tokenId).toString();
  collectible.collection = event.address.toHex();
  collectible.owner = event.params.to.toHex();

  collectible.save();
}
