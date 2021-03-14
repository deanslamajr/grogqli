type GetRandomNumber = (params: { max: number }) => number;

export const getRandomNumber: GetRandomNumber = ({ max }) => {
  // the alg rarely generates the max so we
  // increase the max by 1 and then correct for it in the end
  const modifiedMax = max + 1;
  let randomNumber = Math.floor(Math.random() * modifiedMax);

  // protect against the rare case of modifiedMax actually being generated
  if (randomNumber === modifiedMax) {
    randomNumber = max;
  }
  return randomNumber;
};
