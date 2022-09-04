import { Table, Button, Modal, Tree } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import React, { useState, useEffect } from 'react'
import service from '../../../api/request'

export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [rigthList, setRigthList] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  useEffect(() => {
    setLoading(true)
    service.get('/roles').then((res) => {
      setDataSource(res.data)
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
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              style={{ marginRight: '10px' }}
              onClick={() => confirm(item)}
            ></Button>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setIsModalVisible(true)
                setCurrentRights(item.rights)
                setCurrentId(item.id)
              }}
            ></Button>
          </>
        )
      },
    },
  ]

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
    setDataSource(dataSource.filter((data) => data.id !== item.id))
    service.delete(`roles/${item.id}`)
  }

  useEffect(() => {
    service.get('rights?_embed=children').then((res) => {
      setRigthList(res.data)
    })
  }, [])

  const handleOk = () => {
    setIsModalVisible(false)
    setDataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    service.patch(`roles/${currentId}`, {
      rights: currentRights
    })
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const onCheck = (checkKeys) => {
    setCurrentRights(checkKeys)
  }
  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        rowKey={(item) => item.id}
      ></Table>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          checkedKeys={currentRights}
          checkStrictly={true}
          onCheck={onCheck}
          treeData={rigthList}
        />
      </Modal>
    </>
  )
}
