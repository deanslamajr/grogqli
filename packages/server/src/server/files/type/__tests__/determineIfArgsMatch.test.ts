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
      numberField: 1,
      stringField: 'hello',
      booleanField: true,
      objectField: {
        numberField: 2,
        stringField: 'again',
        booleanField: false,
      },
    };

    const recordedVariables: HydratedVariables<{ input: typeof value }> = {
      input: value,
    };

    describe('arg root: SKIP', () => {
      const matchStrategies: HydratedMatchStrategies<
        typeof recordedVariables
      > = {
        input: 'SKIP',
      };

      describe('match', () => {
        it('should return true', () => {
          const args: Args = {
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
          const matchStrategies: HydratedMatchStrategies<{
            input: typeof value;
          }> = {
            input: {
              numberField: 'SKIP',
              stringField: 'SKIP',
              booleanField: 'SKIP',
              objectField: 'SKIP',
            },
          };

          describe('every field matches', () => {
            it('should return true', () => {
              const args: Args = {
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
              objectField: 'EXACT',
            },
          };

          describe('every field matches', () => {
            it('should return true', () => {
              const args: Args = {
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

          describe('every field matches but this field misses', () => {
            it('should return false', () => {
              const args: Args = {
                input: {
                  ...JSON.parse(JSON.stringify(value)),
                  stringField: 'never going to match',
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

      describe('Object field', () => {
        describe('SKIP', () => {
          const matchStrategies: HydratedMatchStrategies<
            typeof recordedVariables
          > = {
            input: {
              numberField: 'SKIP',
              stringField: 'SKIP',
              booleanField: 'SKIP',
              objectField: 'SKIP',
            },
          };

          describe('every field matches', () => {
            it('should return true', () => {
              const args: Args = {
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
              const args: Args = {
                input: {
                  ...JSON.parse(JSON.stringify(value)),
                  objectField: {
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
              const args: Args = {
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

          describe('every field matches but the Object field misses', () => {
            describe('a nested SKIP misses', () => {
              xit('should return true', () => {});
            });

            describe('a nested EXACT misses', () => {
              xit('should return false', () => {});
            });
          });
        });
      });

      describe('Array field', () => {
        describe('SKIP', () => {
          describe('every field matches', () => {
            xit('should return true', () => {});
          });

          describe('every field matches the Array field misses', () => {
            xit('should return true', () => {});
          });
        });

        describe('EXACT', () => {
          describe('every field matches', () => {
            xit('should return true', () => {});
          });

          describe('every field matches but the Array field misses', () => {
            describe('primitive array members', () => {
              describe('SKIP misses', () => {
                xit('should return true', () => {});
              });

              describe('EXACT misses', () => {
                xit('should return false', () => {});
              });
            });

            describe('Object array members', () => {
              describe('an Object member`s SKIP field misses', () => {
                xit('should return true', () => {});
              });

              describe('an Object member`s EXACT field misses', () => {
                xit('should return false', () => {});
              });
            });
          });
        });
      });
    });
  });

  describe('Array variable', () => {
    describe('SKIP', () => {
      const matchStrategies: HydratedMatchStrategies = {
        input: 'SKIP' as MatchStrategyValue,
      };

      describe('match', () => {
        xit('should return true', () => {
          const args: Args = {
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

    describe('EXACT', () => {
      describe('every field matches', () => {
        xit('should return true', () => {});
      });

      describe('primitive array members', () => {
        describe('SKIP misses', () => {
          xit('should return true', () => {});
        });

        describe('EXACT misses', () => {
          xit('should return false', () => {});
        });
      });

      describe('Object array members', () => {
        describe('an Object member`s SKIP field misses', () => {
          it('should return true', () => {});
        });

        describe('an Object member`s EXACT field misses', () => {
          it('should return false', () => {});
        });
      });
    });
  });

  describe('multiple variables', () => {
    describe('if all variables match', () => {
      xit('should return true', () => {});
    });

    describe('if all variables miss', () => {
      xit('should return false', () => {});
    });

    describe('some misses, some matches', () => {
      xit('should return false', () => {});
    });
  });
});
