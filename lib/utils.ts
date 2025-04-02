import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toJson<T>(val: T): T {
  return JSON.parse(JSON.stringify(val))
}

export function formatNumberToPrice(num: number): string {
  const [int, decimal] = num.toString().split('.')
  return decimal 
    ? `${int}.${decimal.padEnd(2,'0')}`
    : `${int}.00`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any){
  if(error.name === 'ZodError'){
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    )
    return fieldErrors.join('. ');
  }else if(
    error.name === 'PrismaClientKnownRequestError' 
    && error.code == 'P2002'
  ) {
    const field = error.meta?.target 
      ? error.meta?.target[0] 
      : 'Field';

    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists...` 

  }else {

    return typeof error.message === 'string' 
      ? error.message
      : JSON.stringify(error.message)
  
  }
}


// round number 2 decimal places.
export function round2(value: number |  string){
  switch(typeof value){
    case "number": 
      return Math.round((value + Number.EPSILON) * 100) / 100;
    case "string": 
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    default:
      throw new Error('Value is not a number or string')
  }
}


const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2
})

export function formatCurrency(ammount: number | string | null) {
  switch(typeof ammount){
    case 'number':
      return CURRENCY_FORMATTER.format(ammount)
    case 'string':
      return CURRENCY_FORMATTER.format(Number(ammount))
    default:
      return 'Nan'
  }
}