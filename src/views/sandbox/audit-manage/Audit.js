import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import service from '../../../api/request'
import {Table,Button,notification} from 'antd'

export default function Audit() {
    const [dataSource, setdataSource] = useState([])
    const navigate = useNavigate()
    const {roleId,region,username}  = JSON.parse(localStorage.getItem("token"))
    useEffect(()=>{
        const roleObj = {
            "1":"superadmin",
            "2":"admin",
            "3":"editor"
        }
        service.get(`/news?auditState=1&_expand=category`).then(res => {
            const list = res.data
            setdataSource(roleObj[roleId]==="superadmin"?list:[
                ...list.filter(item=>item.author===username),
                ...list.filter(item=>item.region===region&& roleObj[item.roleId]==="editor")
            ])
        })
    },[roleId,region,username])

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
                   <Button type="primary" onClick={()=>handleAudit(item,2,1)}>通过</Button>
                   <Button danger onClick={()=>handleAudit(item,3,0)}>驳回</Button>
                </div>
            }
        }
    ];

    const handleAudit = (item,auditState,publishState)=>{
        setdataSource(dataSource.filter(data=>data.id!==item.id))

        service.patch(`/news/${item.id}`,{
            auditState,
            publishState
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                  `您可以到[审核管理/审核列表]中查看您的新闻的审核状态`,
                placement:"bottomRight"
            });
        })
    }
    return (
        <div>
                <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }} 
                
                rowKey={item=>item.id}
                />
        </div>
    )
}
