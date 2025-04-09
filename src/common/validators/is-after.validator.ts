import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAfter', async: false })
export class IsAfterConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints as string[];
    const relatedValue = (args.object as Record<string, string>)[relatedPropertyName];

    if (!propertyValue || !relatedValue) return false;

    const propertyDate = new Date(propertyValue);
    const relatedDate = new Date(relatedValue);

    return propertyDate > relatedDate;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints as string[];
    return `${args.property} must be later than ${relatedPropertyName}`;
  }
}
