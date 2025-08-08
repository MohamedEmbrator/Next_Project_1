import ArticleItem from "@/components/articles/ArticleItem";
import type { Metadata } from "next";
import Pagination from "./Pagination";
import SearchArticleInput from "@/components/articles/SearchArticleInput";
import { Article } from "@/generated/prisma";
import { getArticles } from "@/apiCalls/articleAPICall";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { prisma } from "@/utils/db";

interface ArticlesPageProps {
  searchParams: { pageNumber: string };
}

const Articles = async ({ searchParams }: ArticlesPageProps) => {
  const { pageNumber } = searchParams;
  const articles: Article[] = await getArticles(pageNumber);
  const count: number = await prisma.article.count();
  const pages = Math.ceil(count / ARTICLE_PER_PAGE);
  return (
    <section className="min-h-[calc(100vh-156px)] container m-auto px-5">
      <SearchArticleInput />
      <div className="flex items-center justify-center flex-wrap gap-7">
        {articles.map((article) => (
          <ArticleItem article={article} key={article.id} />
        ))}
      </div>
      <Pagination pages={pages} pageNumber={+pageNumber} route="/articles" />
    </section>
  );
};

export default Articles;

export const metadata: Metadata = {
  title: "Articles Page",
  description: "Articles About Programming"
}