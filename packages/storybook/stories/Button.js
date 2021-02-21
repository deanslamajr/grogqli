import React from "react";
import { useLazyQuery, gql } from '@apollo/client';

import "./button.css";

const EXCHANGE_RATES = gql`
  query GetExchangeRates {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

export const Button = (props) => {
  const [getExchangeRates, { loading, error, data }] = useLazyQuery(EXCHANGE_RATES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (<div>
    <button {...props} className="button" onClick={getExchangeRates}/>
    {
      (data && data.rates && Array.isArray(data.rates))
        ? data.rates.map(({ currency, rate }) => (
          <div key={currency}>
            <p>
              {currency}: {rate}
            </p>
          </div>
        ))
        : null
    }
  </div>);
}
