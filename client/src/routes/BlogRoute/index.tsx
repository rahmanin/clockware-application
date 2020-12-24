import React, { FunctionComponent, useEffect, useState } from 'react';
import './index.scss';
import { Button, Space} from "antd";
import { Loader } from '../../components/Loader';
import { postData } from '../../api/postData';

interface News {
  id?: number,
  title: string,
  content: string,
  createdAt?: string
}

interface NewsPagination {
  currentPage: number;
  totalNews: number;
  news: News[]
  totalPages: number
}

export const Blog: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newsPagination, setNewsPagination] = useState<NewsPagination>({} as NewsPagination);

  const getNewsPagination = (page: number) => {
    setIsLoading(true)
    postData({page: page}, "news_pagination")
      .then((res: NewsPagination) => setNewsPagination(res))
      .then(() => setIsLoading(false))
  }

  useEffect(() => {
    getNewsPagination(0)
  }, [])

  if (isLoading) return <Loader />

  return (
    <div className="news_wrapper">
      {
        newsPagination?.news?.map(el => {
          return (
            <div 
              className="news_card"
            >
              <div
                className="news_card_title"
              >
                <span className="title">{el.title}</span>
                <span className="created_at">{`${el.createdAt?.split("T")[0]} at ${el.createdAt?.split("T")[1].split('.')[0]}`}</span>
              </div>
              <div 
                className="news_card_content"
                dangerouslySetInnerHTML={{__html: el.content}} 
              />
            </div>
          )
        })
      }
    <Space className="news_nav_buttons">
    <Button
      type="dashed" 
      hidden={newsPagination?.currentPage === 0}
      onClick={() => getNewsPagination(newsPagination?.currentPage - 1)}
    >
      Show previous 5
    </Button>
    <Button
      type="dashed" 
      hidden={newsPagination?.currentPage + 1 === newsPagination.totalPages}
      onClick={() => getNewsPagination(newsPagination?.currentPage + 1)}
    >
      Show next 5
    </Button>
    </Space>
    </div>
  );
};
