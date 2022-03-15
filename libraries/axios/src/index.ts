import axios, { Axios, AxiosInstance } from "axios";

type DivopsAxiosHeaders = Record<string, string>;

interface DivopsAxiosOptions {
  baseURL?: string;
  headers?: DivopsAxiosHeaders | undefined | null;
  verboseError?: boolean | undefined | null;
  config?: Record<string, string> | undefined | null;
}

interface DivopsAxiosInstance extends DivopsAxiosOptions {
  instance: AxiosInstance;
  get: Axios["get"];
  post: Axios["post"];
}

const divopsAxios = {
  create: (options: DivopsAxiosOptions): DivopsAxiosInstance => {
    const instance = axios.create(
      options.baseURL != null ? { baseURL: options.baseURL } : {}
    );

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

const { create } = divopsAxios;

export { create, DivopsAxiosOptions, DivopsAxiosInstance };

export default divopsAxios;
