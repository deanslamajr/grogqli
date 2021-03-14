import React from 'react';

import styles from './index.module.css';
import * as GeneratedTypes from '../generated/schema';
import { LOCAL_GQL_KEY } from '../lib/apollo';

const iterateEnum = (someEnum) => {
  const markup = [] as JSX.Element[];
  for (const value in someEnum) {
    markup.push(
      <option value={value.toUpperCase()}>{value.toUpperCase()}</option>
    );
  }
  return markup;
};

export const ValuesContainer: React.FC<{}> = ({}) => {
  const [
    currentType,
    setCurrentType,
  ] = React.useState<GeneratedTypes.InputThingType>(
    GeneratedTypes.InputThingType.Mac
  );
  const [
    getValues,
    { data: valuesData, loading: isValuesLoading },
  ] = GeneratedTypes.useGetValuesLazyQuery({
    fetchPolicy: 'network-only',
    context: {
      clientName: LOCAL_GQL_KEY,
    },
  });

  return (
    <div className={styles['form']}>
      {/* TYPE DROPDOWN */}
      <label for="type">Which type?</label>
      <select
        name="type"
        id="type-dropdown"
        onChange={(e) =>
          setCurrentType(e.target.value as GeneratedTypes.InputThingType)
        }
        value={currentType}
      >
        {iterateEnum(GeneratedTypes.InputThingType)}
      </select>

      <div>
        <input
          value="Get values!"
          type="button"
          onClick={() =>
            getValues({
              variables: { input: { type: currentType } },
            })
          }
        />
      </div>
      <div>
        {valuesData && valuesData.inputThings
          ? valuesData.inputThings.map((inputThing) => (
              <div>{JSON.stringify(inputThing)}</div>
            ))
          : null}
      </div>
      <div>{isValuesLoading ? 'loading values' : null}</div>
    </div>
  );
};
