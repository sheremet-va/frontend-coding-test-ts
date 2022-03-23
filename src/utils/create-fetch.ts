interface FetchShorthand {
  <T>(url: string, options?: RequestInit): Promise<T>
}

interface Fetcher {
  get: FetchShorthand
}

export class FetchError extends Error {
  constructor(public response: Response) {
    super(response.statusText)
  }
}

export default (basUrl: string): Fetcher => {
  const call = async <T>(
    method: string,
    url: string,
    options?: RequestInit,
  ): Promise<T> => {
    const response = await fetch(encodeURI(basUrl + url), {
      method,
      ...options,
    })

    if (!response.ok) {
      throw new FetchError(response)
    }

    return response.json()
  }

  const get = call.bind(null, 'GET')

  return {
    get,
  } as Fetcher
}
