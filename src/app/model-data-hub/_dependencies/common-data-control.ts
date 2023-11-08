import { isEqual } from 'lodash-es';

export interface ICommonDataControl<T = any> {
  [key: string]: any;

  convertStringToJsDate(data: any): Date | null;

  /**
   * Compares property names and replaces values for matched property names.
   * @param {object} data - Another object with shared properties.
   */
  copyValuesFrom(data: any): void;

  /**
   * Extracts different values from another object and returns the property keys in a string array.
   * @param object - Another object to compare values with.
   * @returns string[] - An array of property keys with different values.
   */
  extractDifferentValuesFrom(object: any): string[];

  /**
   * @param object object to compare to
   * @param escapeProps
   * @returns true if objects are equal, otherwise false
   */
  compareWith(object: any, escapeProps?: string[]): boolean;

  /**
   * Clones the current object into a new object in serialized form, excluding methods.
   * @returns serialized object.
   */
  cloneSerialized(): Partial<T>;
}

export abstract class CommonDataControl<T = any>
  implements ICommonDataControl<T>
{
  [key: string]: any;

  compareWith(object: any, escapeProps?: string[]): boolean {
    const thisObject = JSON.parse(JSON.stringify(this));
    const newObject = JSON.parse(JSON.stringify(object));
    delete thisObject.id;
    delete newObject.id;
    if (escapeProps) {
      escapeProps.forEach((prop) => {
        delete thisObject[prop];
        delete newObject[prop];
      });
    }
    return isEqual(thisObject, newObject);
  }

  extractDifferentValuesFrom(data: any): string[] {
    const returnValue: string[] = [];
    const thisObject = JSON.parse(JSON.stringify(this));
    const externalObject = JSON.parse(JSON.stringify(data));
    delete thisObject.id;
    delete externalObject.id;
    const externalKeys = Object.keys(externalObject);
    const thisKeys = Object.keys(thisObject);

    externalKeys.forEach((extKey) => {
      // loop only through the same keys, (props)
      if (thisKeys.find((thisKey) => thisKey === extKey)) {
        if (
          thisObject[extKey] !== externalObject[extKey] &&
          typeof thisObject[extKey] !== 'object'
        ) {
          returnValue.push(extKey);
        }
      }
    });
    return returnValue;
  }

  convertStringToJsDate(data: any): Date | null {
    const rawDate = Date.parse(data);
    if (
      typeof data === 'string' &&
      !isNaN(rawDate) &&
      !data.startsWith('000')
    ) {
      return new Date(rawDate);
    } else {
      return null;
    }
  }

  copyValuesFrom(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return this;
    }

    const dataKeys = Object.keys(data);
    const thisKeys = Object.keys(this);

    dataKeys.forEach((dKey) => {
      if (thisKeys.find((tKey) => tKey === dKey)) {
        if (dKey.includes('Date') && !(data[dKey] instanceof Date)) {
          this[dKey] = this.convertStringToJsDate(data[dKey]);
        } else {
          if (this[dKey] instanceof CommonDataControl) {
            this[dKey].copyValuesFrom(data[dKey]);
          } else if (Array.isArray(this[dKey])) {
            this[dKey] = JSON.parse(JSON.stringify(data[dKey]));
          } else {
            this[dKey] = data[dKey];
          }
        }
      }
    });

    return this;
  }

  cloneSerialized(): Partial<T> {
    return JSON.parse(JSON.stringify(this));
  }
}
