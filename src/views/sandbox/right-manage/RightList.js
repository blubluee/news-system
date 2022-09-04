import React, { useEffect, useState } from 'react'
import { Button, Table, Tag, Modal, Switch, Popover } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import service from '../../../api/request'

export default function RightList() {
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    service.get('/rights?_embed=children').then((res) => {
      const list = res.data
      list.forEach((element) => {
        if (element.children.length === 0) {
          element.children = ''
        }
      })
      setDataSource(list)
      setLoading(false)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      },
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="gold">{key}</Tag>
      },
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              style={{ marginRight: '10px' }}
              onClick={() => confirm(item)}
            ></Button>
            <Popover
              content={
                <Switch
                  checked={item.pagepermisson}
                  onChange={() => changeSwitch(item)}
                ></Switch>
              }
              title="页面配置项"
              trigger={item.pagepermisson === undefined ? '' : 'click'}
            >
              <Button
                type="primary"
                shape="circle"
                disabled={item.pagepermisson === undefined}
                icon={<EditOutlined />}
              ></Button>
            </Popover>
          </div>
        )
      },
    },
  ]

  const changeSwitch = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])
    if (item.grade === 1) {
      service.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {
      service.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
  }

  const confirm = (item) => {
    Modal.confirm({
      title: 'Are you sure delete this task?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteInfo(item)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const deleteInfo = (item) => {
    if (item.grade === 1) {
      setLoading(true)
      service.delete(`/rights/${item.id}`).then(() => {
        setDataSource(dataSource.filter((data) => data.id !== item.id))
        setLoading(false)
      })
    } else {
      let list = dataSource.find((data) => data.id === item.rightId)
      list.children = list.children.filter((data) => data.id !== item.id)
      setLoading(true)
      service.delete(`/children/${item.id}`).then(() => {
        setDataSource([...dataSource])
        setLoading(false)
      })
    }
  }

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        loading={loading}
      />
    </>
  )
}
