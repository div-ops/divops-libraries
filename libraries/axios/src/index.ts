import axios, { Axios, AxiosInstance } from "axios";

type DivopsAxiosHeaders = Record<string, string>;

interface DivopsAxiosOptions {
  headers?: DivopsAxiosHeaders | undefined | null;
  verboseError?: boolean | undefined | null;
  config?: Record<string, string> | undefined | null;
}

export interface DivopsAxiosInstance extends DivopsAxiosOptions {
  instance: AxiosInstance;
  get: Axios["get"];
  post: Axios["post"];
}

export default {
  create: (options: DivopsAxiosOptions): DivopsAxiosInstance => {
    const instance = axios.create();

    if (options.headers != null) {
      instance.defaults.headers.common = options.headers;
    }

    instance.interceptors.request.use(
      (config) => config,
      (error) => {
        if (options.verboseError) {
          console.log(error.response);
          console.error(error.message);
          console.error(error.stack);
        }
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (options.verboseError) {
          console.log(error.response);
          console.error(error.message);
          console.error(error.stack);
        }
        return Promise.reject(error);
      }
    );

    return {
      instance,
      get: instance.get,
      post: instance.post,
      ...options,
    };
  },
};
