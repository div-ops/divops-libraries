import { createResource } from "./createResource";
import { deleteResource } from "./deleteResource";
import { readResource } from "./readResource";
import { readResources } from "./readResources";
import { updateResource } from "./updateResource";

export const ResourceAPI = {
  of: (model: string) => {
    return {
      create: <R, S>({ resource, summary }: { resource: R; summary: S }) =>
        createResource<R, S>({ model, resource, summary }),
      read: ({ id }: { id: string }) => readResource({ model, id }),
      readList: ({ pageNo = 1 }: { pageNo?: number } = {}) =>
        readResources({ model, pageNo }),
      update: <R, S>({
        id,
        resource,
        summary,
      }: {
        id: string;
        resource: R;
        summary: S;
      }) => updateResource<R, S>({ model, id, resource, summary }),
      delete: ({ id }: { id: string }) => deleteResource({ model, id }),
    };
  },
};
