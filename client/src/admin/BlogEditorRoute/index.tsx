import React, { FunctionComponent, useEffect, useState } from 'react';
import { Editor } from "@tinymce/tinymce-react";
import {
  Button,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table
} from 'antd';
import { useFormik } from 'formik';
import './index.scss';
import { postData } from '../../api/postData';
import { Loader } from '../../components/Loader';
import { updateElement } from '../../api/updateElement';
import {useDispatch} from "react-redux";
import { useSelector } from "react-redux";
import {newsList, newsLoading} from "../../store/news/selectors";
import {deleteNews, getNews} from "../../store/news/actions";

interface News {
  id?: number,
  title: string,
  content: string,
  createdAt?: string
}

export const BlogEditor: FunctionComponent = () => {
  const [editableNews, setEditableNews] = useState<News>({} as News)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isOpenSaveNews, setIsOpenSaveNews] = useState<boolean>(false)
  const [isOpenEditNews, setIsOpenEditNews] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoaderWhenDelete, setShowLoaderWhenDelete] = useState<boolean>(false);
  const [editorStatus, setEditorStatus] = useState<string>("Creating news")
  const dispatch: Function = useDispatch();
  const news: Array<News> = useSelector(newsList);
  const newsIsLoading = useSelector<boolean>(newsLoading);

  useEffect(() => {
    isOpenEditNews && dispatch(getNews())
  }, [isOpenEditNews])

  const handleCancel = (): void => {
    setIsOpenSaveNews(false);
    setIsOpenEditNews(false);
  };
  
  const updateNews = (values: News) => {
    return updateElement(values, "PUT", 'news', editableNews.id)
    .then(() => {
      setEditorStatus(`Edit ${values.title}, id:${editableNews.id}`);
      setEditableNews({...values, id: editableNews.id})
      setIsOpenSaveNews(false);
    })
    .then(() => setIsLoading(false))
  }

  const createNews = (values: News): Promise<any> => {
    return postData(values, "news")
    .then((res: News) => {
      setEditorStatus(`Edit ${res.title}, id:${res.id}`);
      setEditableNews(res)
      setIsOpenSaveNews(false);
    })
    .then(() => setIsLoading(false))
  }

  const deleteElement = (el: News) => {
    setShowLoaderWhenDelete(true)
    updateElement(el, 'DELETE', "news", el.id)
      .then(() => {
        dispatch(deleteNews(el.id))
        setShowLoaderWhenDelete(false)
      })
  }

  const openToEdit = (news: News) => {
    setEditorStatus(`Edit ${news.title}, id:${news.id}`);
    setEditableNews(news)
    setIsOpenEditNews(false)
  } 

  const submitFunction = (values: News) => {
    setIsLoading(true)
    return isEditing ? updateNews(values) : createNews(values)
  }

  const formikNews = useFormik<News>({
    initialValues: {
      title: editableNews?.title || "",
      content: editableNews?.content || ""
    },
    onSubmit: (values: News) => submitFunction(values),
    enableReinitialize: true
  });

  const formikNewsSubmit = () => {
    formikNews.handleSubmit();
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "1"
    },
    {
      title: "Title",
      key: "2",
      dataIndex: "title"
    },
    {
      title: "Created at",
      key: "3",
      render: (record: News) => {
        return `${record.createdAt?.split("T")[0]} at ${record.createdAt?.split("T")[1].split('.')[0]}`
      }
    },
    {
      title: "Action",
      key: "operation",
      render: (record: News) => {
        return (
          <Space>
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => deleteElement(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
            <Button 
              type="dashed" 
              onClick={() => openToEdit(record)}
            >Open</Button>
          </Space>
        )
      }
    }
  ]

  const data = news.map((el, index) => {
    return {
      key: index,
      ...el
    }
  })

  if (isLoading) return <Loader />

  return (
    <div className="editor_wrapper">
      <div className="editor">
      <h2 className="editor_status_panel">{editorStatus}</h2>
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
                if(e.command == "mceNewDocument") {
                  setEditableNews({} as News);
                  setEditorStatus("Creating news")
                }
              });
            }
          }}
          value={formikNews.values.content}
          onEditorChange={(content: string) => formikNews.setFieldValue("content", content)}
        />
      </div>
      <Space className="editor_buttons">
        <Button 
          onClick={() => {
            setIsOpenSaveNews(true)
            setIsEditing(false)
            formikNews.setFieldValue("title", "")
          }}
          type="primary"
        >Save as</Button>
        <Button 
          onClick={() => {
            setIsOpenSaveNews(true)
            setIsEditing(true)
            formikNews.setFieldValue("title", editableNews.title)
          }}
          type="dashed"
          disabled={!editableNews?.id}
        >Update news</Button>
        <Button 
          onClick={() => setIsOpenEditNews(true)}
          type="dashed"
        >Open news list</Button>
      </Space>
      <Modal
        title={isEditing ? "Update news" : "Save news"}
        closable={true}
        onCancel={handleCancel}
        visible={isOpenSaveNews}
        footer={false}
      >
        <Input 
          name="title" 
          placeholder="Enter title"
          onChange={formikNews.handleChange}
          value={formikNews.values.title}
        />
        <Button 
          onClick={formikNewsSubmit}
          type="primary"
        >Ok</Button>
      </Modal>
      <Modal
        className="edit_news_modal"
        title="Edit news"
        closable={true}
        onCancel={handleCancel}
        visible={isOpenEditNews}
        footer={false}
      >
        {
          newsIsLoading || showLoaderWhenDelete ? 
            <Loader />
          :
            <Table
              bordered={true}
              className='news_table'
              pagination={false}
              columns={columns} 
              dataSource={data} 
            />
        }
      </Modal>
    </div>
  );
};
