import React, { FunctionComponent, useEffect, useState } from 'react';
import './index.scss';
import { Button, Input, Popconfirm} from "antd";
import { Loader } from '../../components/Loader';
import { postData } from '../../api/postData';
import { updateElement } from '../../api/updateElement';
import { Editor } from '@tinymce/tinymce-react';
import { useFormik } from 'formik';
import {UserData} from "../../store/users/actions"
import {userParams} from "../../store/users/selectors";
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

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
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newsPagination, setNewsPagination] = useState<NewsPagination>({} as NewsPagination);
  const [editorStatus, setEditorStatus] = useState<string>("Creating news")
  const [editableNews, setEditableNews] = useState<News>({} as News)
  const [curretPage, setCurrentPage] = useState<number>(0)
  const [isEditorVisible, setIsEditorVisible] = useState<boolean>(false)
  const userData: UserData = useSelector(userParams)
  const isAdmin: boolean = userData && userData.role === "admin"

  const getNewsPagination = (page: number) => {
    setIsLoading(true)
    postData({page: page}, "news_pagination")
      .then((res: NewsPagination) => {
        setNewsPagination(res)
        setCurrentPage(res.currentPage)
      })
      .then(() => setIsLoading(false))
  }

  useEffect(() => {
    getNewsPagination(0)
  }, [])

  const onCancelEditor = () => {
    setIsEditorVisible(false)
  }

  const createNewsHandleClick = () => {
    setEditorStatus("Creating news")
    setEditableNews({} as News)
    setIsEditing(false)
    setIsEditorVisible(true)
  }

  const deleteElement = (el: News) => {
    setIsLoading(true)
    updateElement(el, 'DELETE', "news", el.id)
      .then(() => {
        getNewsPagination(curretPage)
        setIsLoading(false)
      })
  }

  const openToEdit = (news: News) => {
    setEditorStatus(`Edit ${news.title}, id:${news.id}`);
    setEditableNews(news)
    setIsEditing(true)
    setIsEditorVisible(true)
  } 

  const updateNews = (values: News) => {
    return updateElement(values, "PUT", 'news', editableNews.id)
    .then(() => {
      setEditorStatus(`Edit ${values.title}, id:${editableNews.id}`);
      setEditableNews({...values, id: editableNews.id})
      getNewsPagination(curretPage)
    })
    .then(() => setIsLoading(false))
  }

  const createNews = (values: News): Promise<any> => {
    return postData(values, "news")
    .then((res: News) => {
      setEditorStatus(`Edit ${res.title}, id:${res.id}`);
      setEditableNews(res)
      getNewsPagination(0)
    })
    .then(() => setIsLoading(false))
  }

  const submitFunction = (values: News) => {
    setIsLoading(true)
    setIsEditorVisible(false)
    return isEditing ? updateNews(values) : createNews(values)
  }

  const formikNews = useFormik<News>({
    initialValues: {
      title: editableNews?.title || "",
      content: editableNews?.content || ""
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('title is required'),
    }),
    onSubmit: (values: News) => submitFunction(values),
    enableReinitialize: true
  });

  const formikNewsSubmit = () => {
    formikNews.handleSubmit();
  };
  
  if (isLoading) return <Loader />

  return (
    <div className="news_wrapper">
      <Button 
        className="create_news_btn"
        type="primary" 
        size="large"
        onClick={() => createNewsHandleClick()}
        hidden={!isAdmin}
        block
      >
        Create news
      </Button>
      <div className="editor" hidden={!isEditorVisible}>
        <h2 className="editor_status_panel">{editorStatus}</h2>
        <Input 
          name="title" 
          placeholder="Enter title of the news"
          onChange={formikNews.handleChange}
          onBlur={formikNews.handleBlur}
          value={formikNews.values.title}/>
        {formikNews.touched.title && formikNews.errors.title ? (
            <div className="error">{formikNews.errors.title}</div>
          ) : null}
        <Editor
          apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
          init={{
            height: 500,
            plugins: [
              'advlist autolink lists link image', 
              'charmap print preview anchor help',
              'searchreplace visualblocks code',
              'insertdatetime media table paste wordcount'
            ],
            toolbar:
              'undo redo | formatselect | bold italic | \
              alignleft aligncenter alignright | \
              bullist numlist outdent indent | help',
            setup: editor => {
              editor.on('ExecCommand', e => {
                if(e.command === "mceNewDocument") {
                  setEditableNews({} as News);
                  setEditorStatus("Creating news")
                }
              });
            }
          }}
          value={formikNews.values.content}
          onEditorChange={(content: string) => formikNews.setFieldValue("content", content)}
        />
        <div className="news_action_buttons">
          <Button
            type="primary" 
            onClick={formikNewsSubmit}
            disabled={!(formikNews.isValid && formikNews.dirty)}
          >
            Save
          </Button>
          <Button 
            type={"default"}
            onClick={() => onCancelEditor()}
          >
            Cansel
          </Button>
        </div>
      </div>
      {
        newsPagination?.news?.map(el => {
          return (
            <div 
              className="news_card"
              hidden={isEditorVisible}
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
              <div className="news_action_buttons" hidden={!isAdmin}>
                <Button
                  type="default" 
                  onClick={() => openToEdit(el)}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure?"
                  onConfirm={() => deleteElement(el)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
              </div>
            </div>
          )
        })
      }
    <div className="news_nav_buttons" hidden={isEditorVisible}>
      <Button
        type="dashed" 
        hidden={newsPagination?.currentPage === 0}
        onClick={() => getNewsPagination(newsPagination?.currentPage - 1)}
      >
        Show previous 5
      </Button>
      <Button
        type="dashed" 
        hidden={newsPagination?.currentPage + 1 === newsPagination?.totalPages}
        onClick={() => getNewsPagination(newsPagination?.currentPage + 1)}
      >
        Show next 5
      </Button>
    </div>
    </div>
  );
};
