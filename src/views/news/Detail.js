import React, { useEffect, useState } from 'react'
import { useMatch } from 'react-router-dom'
import { PageHeader, Descriptions } from 'antd';
import moment from 'moment'
import service from '../../api/request';
import {HeartTwoTone} from '@ant-design/icons'
export default function Detail() {
    const [newsInfo, setnewsInfo] = useState(null)
    const match = useMatch('/detail/:id')
    useEffect(() => {
        // console.log()
        service.get(`/news/${match.params.id}?_expand=category&_expand=role`).then(res => {
            setnewsInfo({
                ...res.data,
                view:res.data.view+1
            })

            //同步后端
            return res.data
        }).then(res=>{
            service.patch(`/news/${match.params.id}`,{
                view:res.view+1
            })
        })
    }, [match.params.id])
    const handleStar = ()=>{
        setnewsInfo({
            ...newsInfo,
            star:newsInfo.star+1
        })

        service.patch(`/news/${match.params.id}`,{
            star:newsInfo.star+1
        })
    }
    return (
        <div>
            {
                newsInfo && <div>

                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={<div>
                            {newsInfo.category.title}
                            <HeartTwoTone twoToneColor="#eb2f96" onClick={()=>handleStar()}/>

                        </div>}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                           
                            <Descriptions.Item label="发布时间">{
                                newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"
                            }</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                           
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>

                    <div dangerouslySetInnerHTML={{
                        __html:newsInfo.content
                    }} style={{
                        margin:"0 24px",
                        border:"1px solid gray"
                    }}>
                    </div>
                </div>
            }
        </div>
    )
}
