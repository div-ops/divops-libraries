import { DivopsAxiosInstance } from "@divops/axios";

export async function getPageList({
  context,
}: {
  context: DivopsAxiosInstance;
}): Promise<
  {
    pageId: string;
    pageUrl: string;
    title: string;
    summary: string;
    created: string;
    lastEdited: string;
  }[]
> {
  const {
    data: { results },
  } = await context.post(
    `/v1/databases/${context.config.databaseId}/query`,
    {}
  );

  return results.map((item) => {
    const { id, url, last_edited_time } = item;

    const { title, summary, created } = JSON.parse(
      item.properties.Name.title[0].text.content
    );

    return {
      pageId: id,
      pageUrl: url,
      title: title,
      summary: summary,
      created: created,
      lastEdited: last_edited_time,
    };
  });
}
