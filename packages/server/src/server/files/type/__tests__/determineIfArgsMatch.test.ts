import { determineIfArgsMatch } from '../determineIfArgsMatch';
import {
  Args,
  HydratedVariables,
  HydratedMatchStrategies,
  MatchStrategyValue,
} from '../types';

describe('determineIfArgsMatch', () => {
  describe('primitive variable', () => {
    const value = 7;

    const recordedVariables: HydratedVariables<{ input: number }> = {
      input: value,
    };

    describe('SKIP', () => {
      const matchStrategies: HydratedMatchStrategies<
        typeof recordedVariables
      > = {
        input: 'SKIP',
      };

      describe('match', () => {
        it('should return true', () => {
          const args: Args = {
            input: value,
          };

          const actual = determineIfArgsMatch({
            args,
            variableRecordings: recordedVariables,
            matchStrategies,
          });

          expect(actual).toEqual(true);
        });
      });

      describe('miss', () => {
        it('should return true', () => {
          const args: Args = {
            input: value,
          };

          const actual = determineIfArgsMatch({
            args,
            variableRecordings: recordedVariables,
            matchStrategies,
          });

          expect(actual).toEqual(true);
        });
      });
    });

    describe('EXACT', () => {
      const matchStrategies: HydratedMatchStrategies<
        typeof recordedVariables
      > = {
        input: 'EXACT',
      };

      describe('match', () => {
        it('should return true', () => {
          const args: Args = {
            input: value,
          };
          const recordedVariables: HydratedVariables<{
            input: typeof value;
          }> = {
            input: value,
          };

          const actual = determineIfArgsMatch({
            args,
            variableRecordings: recordedVariables,
            matchStrategies,
          });

          expect(actual).toEqual(true);
        });
      });

      describe('miss', () => {
        it('should return false', () => {
          const args: Args = {
            input: 10,
          };

          const actual = determineIfArgsMatch({
            args,
            variableRecordings: recordedVariables,
            matchStrategies,
          });

          expect(actual).toEqual(false);
        });
      });
    });
  });

  describe('Object variable', () => {
    const value = {
      input: {
        numberField: 1,
        stringField: 'hello',
        booleanField: true,
        objectField: {
          numberField: 2,
          stringField: 'again',
          booleanField: false,
        },
      },
    };

    const recordedVariables: HydratedVariables<typeof value> = JSON.parse(
      JSON.stringify(value)
    );

    describe('arg root: SKIP', () => {
      const matchStrategies: HydratedMatchStrategies<
        typeof recordedVariables
      > = {
        input: 'SKIP',
      };

      describe('match', () => {
        it('should return true', () => {
          const args: typeof value = JSON.parse(JSON.stringify(value));

          const actual = determineIfArgsMatch({
            args,
            variableRecordings: recordedVariables,
            matchStrategies,
          });

          expect(actual).toEqual(true);
        });
      });

      describe('miss', () => {
        it('should return true', () => {
          const args: Args = {
            input: {
              ...value,
              numberField: 0,
            },
          };

          const actual = determineIfArgsMatch({
            args,
            variableRecordings: recordedVariables,
            matchStrategies,
          });

          expect(actual).toEqual(true);
        });

        it('should return true', () => {
          const args: Args = {
            input: {
              ...value,
              objectField: {
                numberField: 3,
              },
            },
          };

          const actual = determineIfArgsMatch({
            args,
            variableRecordings: recordedVariables,
            matchStrategies,
          });

          expect(actual).toEqual(true);
        });
      });
    });

    describe('arg root: EXACT', () => {
      describe('primitive field', () => {
        describe('SKIP', () => {
          const matchStrategies: HydratedMatchStrategies<typeof value> = {
            input: {
              numberField: 'SKIP',
              stringField: 'SKIP',
              booleanField: 'SKIP',
              objectField: 'SKIP',
            },
          };

          describe('every field matches', () => {
            it('should return true', () => {
              const args: typeof value = JSON.parse(JSON.stringify(value));

              const actual = determineIfArgsMatch({
                args,
                variableRecordings: recordedVariables,
                matchStrategies,
              });

              expect(actual).toEqual(true);
            });
          });

          describe('every field matches but this field misses', () => {
            it('should return true', () => {
              const args: Args = {
                input: {
                  ...JSON.parse(JSON.stringify(value)),
                  stringField: 'not going to match',
                },
              };

              const actual = determineIfArgsMatch({
                args,
                variableRecordings: recordedVariables,
                matchStrategies,
              });

              expect(actual).toEqual(true);
            });
          });
        });

        describe('EXACT', () => {
          const matchStrategies: HydratedMatchStrategies<
            typeof recordedVariables
          > = {
            input: {
              numberField: 'EXACT',
              stringField: 'EXACT',
              booleanField: 'EXACT',
              objectField: {
                numberField: 'EXACT',
                stringField: 'EXACT',
                booleanField: 'EXACT',
              },
            },
          };

          describe('every field matches', () => {
            it('should return true', () => {
              const args: typeof value = JSON.parse(JSON.stringify(value));

              const actual = determineIfArgsMatch({
                args,
                variableRecordings: recordedVariables,
                matchStrategies,
              });

              expect(actual).toEqual(true);
            });
          });

          describe('every field matches but this field misses', () => {
            it('should return false', () => {
              const args: typeof value = JSON.parse(JSON.stringify(value));
              args.input.objectField.stringField = 'never going to match';

              const actual = determineIfArgsMatch({
                args,
                variableRecordings: recordedVariables,
                matchStrategies,
              });

              expect(actual).toEqual(false);
            });
          });
        });
      });

      describe('Object field', () => {
        describe('SKIP', () => {
          const matchStrategies: HydratedMatchStrategies<typeof value> = {
            input: {
              numberField: 'SKIP',
              stringField: 'SKIP',
              booleanField: 'SKIP',
              objectField: 'SKIP',
            },
          };

          describe('every field matches', () => {
            it('should return true', () => {
              const args: typeof value = {
                input: JSON.parse(JSON.stringify(value)),
              };

              const actual = determineIfArgsMatch({
                args,
                variableRecordings: recordedVariables,
                matchStrategies,
              });

              expect(actual).toEqual(true);
            });
          });

          describe('every field matches the Object field misses', () => {
            it('should return true', () => {
              const copyOfValue = JSON.parse(JSON.stringify(value));

              const args: typeof value = {
                input: {
                  ...copyOfValue,
                  objectField: {
                    ...copyOfValue.objectField,
                    stringField: 'this wont match either',
                  },
                },
              };

              const actual = determineIfArgsMatch({
                args,
                variableRecordings: recordedVariables,
                matchStrategies,
              });

              expect(actual).toEqual(true);
            });
          });
        });

        describe('EXACT', () => {
          const copyOfValue: typeof value = JSON.parse(JSON.stringify(value));

          const matchStrategies: HydratedMatchStrategies<typeof value> = {
            input: {
              numberField: 'EXACT',
              stringField: 'EXACT',
              booleanField: 'EXACT',
              objectField: {
                numberField: 'EXACT',
                stringField: 'EXACT',
                booleanField: 'EXACT',
              },
            },
          };

          describe('every field matches', () => {
            it('should return true', () => {
              const actual = determineIfArgsMatch({
                args: copyOfValue,
                variableRecordings: recordedVariables,
                matchStrategies,
              });

              expect(actual).toEqual(true);
            });
          });

          describe('a nested EXACT misses', () => {
            it('should return false', () => {
              const args: typeof value = {
                ...copyOfValue,
                input: {
                  ...copyOfValue.input,
                  objectField: {
                    ...copyOfValue.input.objectField,
                    stringField: 'never going to match this',
                  },
                },
              };

              const actual = determineIfArgsMatch({
                args,
                variableRecordings: recordedVariables,
                matchStrategies,
              });

              expect(actual).toEqual(false);
            });
          });
        });
      });
    });
  });

  describe('Array variable', () => {
    const value = {
      input: {
        numberField: 1,
        stringField: 'hello',
        booleanField: true,
        arrayField: [
          'hello',
          {
            numberField: 1,
            stringField: 'good bye',
            booleanField: false,
          },
        ] as [
          string,
          {
            numberField: number;
            stringField: string;
            booleanField: boolean;
          }
        ],
      },
    };

    const recordedVariables: HydratedVariables<typeof value> = JSON.parse(
      JSON.stringify(value)
    );

    describe('SKIP', () => {
      const matchStrategies: HydratedMatchStrategies<typeof value> = {
        input: {
          numberField: 'SKIP',
          stringField: 'SKIP',
          booleanField: 'SKIP',
          arrayField: 'SKIP',
        },
      };

      describe('match', () => {
        it('should return true', () => {
          const args: typeof value = JSON.parse(JSON.stringify(value));

          const actual = determineIfArgsMatch({
            args,
            variableRecordings: recordedVariables,
            matchStrategies,
          });

          expect(actual).toEqual(true);
        });
      });

      describe('miss', () => {
        describe('array item exists but an item field misses', () => {
          it('should return true', () => {
            const args: typeof value = JSON.parse(JSON.stringify(value));
            args.input.arrayField[1] = {
              ...args.input.arrayField[1],
              stringField: 'cant possibly match',
            };

            const actual = determineIfArgsMatch({
              args,
              variableRecordings: recordedVariables,
              matchStrategies,
            });

            expect(actual).toEqual(true);
          });
        });

        describe('missing array item', () => {
          it('should return true', () => {
            const copyOfValue: typeof value = JSON.parse(JSON.stringify(value));
            const args: typeof value = {
              ...copyOfValue,
              input: {
                ...copyOfValue.input,
                // @ts-ignore
                arrayField: ['hello'],
              },
            };

            const actual = determineIfArgsMatch({
              args,
              variableRecordings: recordedVariables,
              matchStrategies,
            });

            expect(actual).toEqual(true);
          });
        });

        describe('missing array field', () => {
          it('should return true', () => {
            const copyOfValue: typeof value = JSON.parse(JSON.stringify(value));
            const inputWithoutArrayField = {
              ...copyOfValue.input,
            };
            // @ts-ignore
            delete inputWithoutArrayField.arrayField;

            const args: typeof value = {
              ...copyOfValue,
              input: inputWithoutArrayField,
            };

            const actual = determineIfArgsMatch({
              args,
              variableRecordings: recordedVariables,
              matchStrategies,
            });

            expect(actual).toEqual(true);
          });

          it('should return true', () => {
            const copyOfValue: typeof value = JSON.parse(JSON.stringify(value));
            const args: typeof value = {
              ...copyOfValue,
              input: {
                ...copyOfValue.input,
                // @ts-ignore
                arrayField: undefined,
              },
            };

            const actual = determineIfArgsMatch({
              args,
              variableRecordings: recordedVariables,
              matchStrategies,
            });

            expect(actual).toEqual(true);
          });
        });
      });
    });

    describe('EXACT', () => {
      const matchStrategies: HydratedMatchStrategies<typeof value> = {
        input: {
          numberField: 'EXACT',
          stringField: 'EXACT',
          booleanField: 'EXACT',
          arrayField: [
            'EXACT',
            {
              numberField: 'EXACT',
              stringField: 'EXACT',
              booleanField: 'EXACT',
            },
          ],
        },
      };

      describe('every field matches', () => {
        it('should return true', () => {
          const args: typeof value = JSON.parse(JSON.stringify(value));

          const actual = determineIfArgsMatch({
            args,
            variableRecordings: recordedVariables,
            matchStrategies,
          });

          expect(actual).toEqual(true);
        });
      });

      describe('array position', () => {
        describe('initial array member misses', () => {
          it('should return false', () => {
            const args: typeof value = JSON.parse(JSON.stringify(value));
            args.input.arrayField[0] = 'this is a miss';

            const actual = determineIfArgsMatch({
              args,
              variableRecordings: recordedVariables,
              matchStrategies,
            });

            expect(actual).toEqual(false);
          });
        });

        describe('array member in position after initial misses', () => {
          it('should return false', () => {
            const args: typeof value = JSON.parse(JSON.stringify(value));
            args.input.arrayField[1] = {
              ...args.input.arrayField[1],
              stringField: 'this is a miss',
            };

            const actual = determineIfArgsMatch({
              args,
              variableRecordings: recordedVariables,
              matchStrategies,
            });

            expect(actual).toEqual(false);
          });
        });
      });

      describe('array member data type', () => {
        describe('primitive array member misses', () => {
          it('should return false', () => {
            const args: typeof value = JSON.parse(JSON.stringify(value));
            args.input.arrayField[0] = 'this is a miss';

            const actual = determineIfArgsMatch({
              args,
              variableRecordings: recordedVariables,
              matchStrategies,
            });

            expect(actual).toEqual(false);
          });
        });

        describe('Object array member misses', () => {
          it('should return false', () => {
            const args: typeof value = JSON.parse(JSON.stringify(value));
            args.input.arrayField[1] = {
              ...args.input.arrayField[1],
              stringField: 'this is a miss',
            };

            const actual = determineIfArgsMatch({
              args,
              variableRecordings: recordedVariables,
              matchStrategies,
            });

            expect(actual).toEqual(false);
          });
        });
      });
    });
  });

  describe('multiple variables', () => {
    const value = {
      input: {
        numberField: 1,
        stringField: 'hello',
        booleanField: true,
      },
      anotherInput: ['goodbye'],
    };

    const recordedVariables: HydratedVariables<typeof value> = JSON.parse(
      JSON.stringify(value)
    );

    describe('SKIP', () => {
      const matchStrategies: HydratedMatchStrategies<typeof value> = {
        input: 'SKIP',
        anotherInput: 'SKIP',
      };

      describe('if all variables match', () => {
        it('should return true', () => {
          const args: typeof value = JSON.parse(JSON.stringify(value));

          const actual = determineIfArgsMatch({
            args,
            variableRecordings: recordedVariables,
            matchStrategies,
          });

          expect(actual).toEqual(true);
        });
      });

      describe('if all variables miss', () => {
        it('should return true', () => {
          const args: typeof value = JSON.parse(JSON.stringify(value));
          args.input = {
            ...args.input,
            stringField: 'this is a miss',
          };
          args.anotherInput = ['this is also a miss'];

          const actual = determineIfArgsMatch({
            args,
            variableRecordings: recordedVariables,
            matchStrategies,
          });

          expect(actual).toEqual(true);
        });
      });

      describe('partial miss', () => {
        it('should return true', () => {
          const args: typeof value = JSON.parse(JSON.stringify(value));
          args.input = {
            ...args.input,
            stringField: 'this is the only miss',
          };

          const actual = determineIfArgsMatch({
            args,
            variableRecordings: recordedVariables,
            matchStrategies,
          });

          expect(actual).toEqual(true);
        });
      });
    });

    describe('EXACT', () => {
      const matchStrategies: HydratedMatchStrategies<typeof value> = {
        input: {
          numberField: 'EXACT',
          stringField: 'EXACT',
          booleanField: 'EXACT',
        },
        anotherInput: ['EXACT'],
      };

      describe('if all variables match', () => {
        it('should return true', () => {
          const args: typeof value = JSON.parse(JSON.stringify(value));

          const actual = determineIfArgsMatch({
            args,
            variableRecordings: recordedVariables,
            matchStrategies,
          });

          expect(actual).toEqual(true);
        });
      });

      describe('if all variables miss', () => {
        it('should return false', () => {
          const args: typeof value = JSON.parse(JSON.stringify(value));
          args.input = {
            ...args.input,
            stringField: 'this is a miss',
          };
          args.anotherInput = ['this is also a miss'];

          const actual = determineIfArgsMatch({
            args,
            variableRecordings: recordedVariables,
            matchStrategies,
          });

          expect(actual).toEqual(false);
        });
      });

      describe('partial miss', () => {
        it('should return false', () => {
          const args: typeof value = JSON.parse(JSON.stringify(value));
          args.input = {
            ...args.input,
            stringField: 'this is the only miss',
          };

          const actual = determineIfArgsMatch({
            args,
            variableRecordings: recordedVariables,
            matchStrategies,
          });

          expect(actual).toEqual(false);
        });
      });
    });
  });
});
