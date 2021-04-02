// this function can hopefully go away in future
// https://github.com/dynamoose/dynamoose/issues/1155

import { Model } from 'dynamoose/dist/Model';

export function applyDefaults(obj: any, model: Model) {
  for (const key in model.schemas[0].schemaObject) {
    const def = (<any>model.schemas[0].schemaObject[key])?.default;
    if (def !== undefined && obj[key] === undefined) {
      if (typeof def === 'function') {
        obj[key] = def();
      } else {
        obj[key] = def;
      }
    }
  }
}