import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import queryString from 'query-string';

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
  console.log(error)
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


// shorten uuid 
export function formatId(id: string) {
  return `...${id.substring(id.length - 6)}`
}

// formate date and times... 

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export const buildUrlQuery = ({
  params,
  key,
  value
} : {
  params: string,
  key: string,
  value: string
}) => {

  const q = queryString.parse(params);
  q[key] = value;

  return queryString.stringifyUrl({
    url: window.location.pathname,
    query: q
  }, { skipNull: true }
) 

}