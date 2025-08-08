import { Article } from "@/generated/prisma";
import { DOMAIN } from "@/utils/constants";
import { SingleArticle } from "@/utils/types";

export async function getArticles(pageNumber: string | undefined): Promise<Article[]> {
  const response = await fetch(`${DOMAIN}/api/articles?pageNumber=${pageNumber}`,
  // {next: {revalidate: 50} }
  { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Failed to Fetch Articles");
  }
  return response.json();
}

export async function getArticlesCount(): Promise<number> {
  const response = await fetch(`${DOMAIN}/api/articles/count`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to Get Articles Count");
  }
  const { count } = await response.json() as { count: number };
  return count;
}

export async function getArticlesBasedOnSearch(searchText: string): Promise<Article[]> {
  const response = await fetch(`${DOMAIN}/api/articles/search?searchText=${searchText}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to Get Articles Count");
  }
  return response.json();
}

export async function getSingleArticle(articleId: string): Promise<SingleArticle> {
  const response = await fetch(`${DOMAIN}/api/articles/${articleId}`, { cache: 'no-store'});
  if (!response.ok) {
    throw new Error("Failed To Fetch This Article Data");
  }
  return response.json();
}