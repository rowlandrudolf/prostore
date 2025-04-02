

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Prostore'
export const APP_DESCRIPTION =  process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Prostore ecommerce application'
export const SERVER_URL =  process.env.SERVER_URL || 'http://localhost:3000/'
export const shippingAddressDefaultValues = {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: ''
}