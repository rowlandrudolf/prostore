const base =  process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

export const paypal  = {
    createOrder: async function createOrder(price: number){
        const token = await generateAccessToken();
        const url = `${base}/v2/checkout/orders`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: price
                        }
                    }
                ]
            })
        })
        return handleResponse(res)
    },
    capturePayment: async function capturePayment(orderId: string){
        const token = await generateAccessToken();
        const res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }  
        })

        return handleResponse(res);
    }
}

async function generateAccessToken(){
    const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET} = process.env;
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString('base64');

    const res = await fetch(`${base}/v1/oauth2/token`, {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-type': 'application/x-www-form-urlencoded'
        },
    })
    const jsonData =  await handleResponse(res);
    return jsonData.access_token
}

async function handleResponse(response: Response){
    if(response.ok){
        return response.json()
    }else {
        const errMsg = await response.text()
        throw new Error(errMsg)
    }
}

export { generateAccessToken }