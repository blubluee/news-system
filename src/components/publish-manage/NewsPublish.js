import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Table} from 'antd'

export default function NewsPublish(props) {
    const navigate = useNavigate()
    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title,item) => {
                return <span style={{color:'skyblue',cursor:'pointer'}} onClick={()=>navigate(`/news-manage/preview/${item.id}`)}>{title}</span>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: "新闻分类",
            dataIndex: 'category',
            render: (category) => {
                return <div>{category.title}</div>
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    {props.button(item.id)}
                </div>
            }
        }
    ];

    return (
        <div>
            <Table dataSource={props.dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }} 
                rowKey={item=>item.id}
                />
        </div>
    )
}
