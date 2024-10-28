import * as core from '@actions/core';

export function getInput(name: string): string {
  return core.getInput(name, { required: true, trimWhitespace: true });
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
