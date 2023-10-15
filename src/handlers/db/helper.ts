interface IKeyValue {
  keyString: string;
  valueString: string;
  keyValue: object;
}

interface IdbInsert {
  query: string;
  keyValue: IGenericObject;
}

export interface IGenericObject {
  [key: string]: any;
}

interface IdbUpdate {
  keyValueString: any;
  keyValueObject: IGenericObject;
}

function getKeyValueForInsert(body: IGenericObject): IKeyValue {
  let keyString = '';
  let valueString = '';
  const keys = Object.keys(body);
  const keyValue: IGenericObject = {};
  for (let i = 0, len = keys.length; i < len; i += 1) {
    const key = keys[i];
    const value = body[keys[i]];
    keyString += i === len - 1 ? key : `${key},`;
    valueString += i === len - 1 ? `$${key}` : `$${key},`;
    keyValue[`$${key}`] = value;
  }

  return { keyString, valueString, keyValue };
}

export function insertRow(tableName: string, body: object): IdbInsert {
  const { keyString, valueString, keyValue } = getKeyValueForInsert(body);
  const query = `INSERT INTO ${tableName} (${keyString}) VALUES (${valueString})`;

  return { query, keyValue };
}

export function getKeyValue(body: IGenericObject): IGenericObject {
  let keyValueString: string = '';
  const keyValueObject: IGenericObject = {};
  const keys = Object.keys(body);
  for (let i = 0, len = keys.length; i < len; i += 1) {
    const key = keys[i];
    const value = body[keys[i]];
    keyValueString += i === len - 1 ? `${key}=$${key}` : `${key}=$${key},`;
    keyValueObject[`$${key}`] = value;
  }
  return { keyValueString, keyValueObject };
}

export function updateTable(tableName: string, body: object, conditionBody: object): IdbInsert {
  const bodyValue = getKeyValue(body);
  const conditionBodyValue = getKeyValue(conditionBody);

  const keyValue = { ...(<[]>bodyValue.keyValueObject), ...(<[]>conditionBodyValue.keyValueObject) };
  const query = `UPDATE ${tableName} SET ${bodyValue.keyValueString} WHERE ${conditionBodyValue.keyValueString}`;

  return { query, keyValue };
}

export function deleteTable(tableName: string, conditionBody: object): IdbInsert {
  const conditionBodyValue = getKeyValue(conditionBody);
  const keyValue = conditionBodyValue.keyValueObject;

  const query = `DELETE FROM ${tableName} WHERE ${conditionBodyValue.keyValueString}`;

  return { query, keyValue };
}
