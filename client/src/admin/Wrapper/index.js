import React, {useState} from 'react';
import {
  useRouteMatch,
} from "react-router-dom";
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  PieChartOutlined,
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import { routes } from "../../constants/routes";
import './index.scss';


const { Header, Content, Sider } = Layout;

export default function AdminWrapper({children}) {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  };

  let { path } = useRouteMatch();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            <Link to={`${path}/${routes.masters}`}>{routes.masters}</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<PieChartOutlined />}>
            <Link to={`${path}/${routes.orders}`}>{routes.orders}</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<PieChartOutlined />}>
            <Link to={`${path}/${routes.cities}`}>{routes.cities}</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} />
          <div className="site-layout-background" style={{ padding: 24, minHeight: 460 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

