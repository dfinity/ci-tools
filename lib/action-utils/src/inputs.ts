import * as core from '@actions/core';

export function getInput(name: string): string {
  const input = core.getInput(name);

  if (input.length === 0) {
    throw new Error(`The ${name} input is required but was not supplied`);
  }

  return input;
}

export function getNumberInput(name: string): number {
  const input = getInput(name);
  const numberInput = Number(input);

  if (isNaN(numberInput)) {
    throw new Error(
      `The ${name} input must be a number but received '${input}'`,
    );
  }

  return numberInput;
}
