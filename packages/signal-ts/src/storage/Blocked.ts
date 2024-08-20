import type { Logger } from '@chatally/logger';
import _ from 'lodash';
import type { ServiceIdString } from '../ids/ServiceIdString';
import type { StorageInterface } from './StorageInterface';

export class Blocked {
  constructor(private readonly storage: StorageInterface, private readonly log: Logger) { }

  public getBlockedNumbers(): Array<string> {
    return this.storage.get('blocked', new Array<string>());
  }

  public isBlocked(number: string): boolean {
    return this.getBlockedNumbers().includes(number);
  }

  public async addBlockedNumber(number: string): Promise<void> {
    const numbers = this.getBlockedNumbers();
    if (numbers.includes(number)) {
      return;
    }

    this.log.info('adding', number, 'to blocked list');
    await this.storage.put('blocked', numbers.concat(number));
  }

  public async removeBlockedNumber(number: string): Promise<void> {
    const numbers = this.getBlockedNumbers();
    if (!numbers.includes(number)) {
      return;
    }

    this.log.info('removing', number, 'from blocked list');
    await this.storage.put('blocked', _.without(numbers, number));
  }

  public getBlockedServiceIds(): Array<ServiceIdString> {
    return this.storage.get('blocked-uuids', new Array<ServiceIdString>());
  }

  public isServiceIdBlocked(serviceId: ServiceIdString): boolean {
    return this.getBlockedServiceIds().includes(serviceId);
  }

  public async addBlockedServiceId(serviceId: ServiceIdString): Promise<void> {
    const serviceIds = this.getBlockedServiceIds();
    if (serviceIds.includes(serviceId)) {
      return;
    }

    this.log.info('adding', serviceId, 'to blocked list');
    await this.storage.put('blocked-uuids', serviceIds.concat(serviceId));
  }

  public async removeBlockedServiceId(
    serviceId: ServiceIdString
  ): Promise<void> {
    const numbers = this.getBlockedServiceIds();
    if (!numbers.includes(serviceId)) {
      return;
    }

    this.log.info('removing', serviceId, 'from blocked list');
    await this.storage.put('blocked-uuids', _.without(numbers, serviceId));
  }

  public getBlockedGroups(): Array<string> {
    return this.storage.get('blocked-groups', new Array<string>());
  }

  public isGroupBlocked(groupId: string): boolean {
    return this.getBlockedGroups().includes(groupId);
  }

  public async addBlockedGroup(groupId: string): Promise<void> {
    const groupIds = this.getBlockedGroups();
    if (groupIds.includes(groupId)) {
      return;
    }

    this.log.info(`adding group(${groupId}) to blocked list`);
    await this.storage.put('blocked-groups', groupIds.concat(groupId));
  }

  public async removeBlockedGroup(groupId: string): Promise<void> {
    const groupIds = this.getBlockedGroups();
    if (!groupIds.includes(groupId)) {
      return;
    }

    this.log.info(`removing group(${groupId} from blocked list`);
    await this.storage.put('blocked-groups', _.without(groupIds, groupId));
  }
}
