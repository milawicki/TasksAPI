export function addMinutes(minutes: number, initDate?: Date): Date {
  const date = initDate || new Date();

  date.setMinutes(date.getMinutes() + minutes);

  return date;
}

export function subtractMinutes(minutes: number, initDate?: Date): Date {
  return addMinutes(-minutes, initDate);
}
