import Footer from '@/components/Footer';
//import RightContent from '@/components/RightContent';
import { LogoutOutlined } from '@ant-design/icons'; //  Import icon Đăng xuất
//import { notification } from 'antd';
//import 'moment/locale/vi';
import { history, RunTimeLayoutConfig } from 'umi';
//import { getIntl, getLocale, history } from 'umi';
//import type { RequestOptionsInit, ResponseError } from 'umi-request';
//import ErrorBoundary from './components/ErrorBoundary';
// import LoadingPage from './components/Loading';
//import { OIDCBounder } from './components/OIDCBounder';
//import { unCheckPermissionPaths } from './components/OIDCBounder/constant';
//import OneSignalBounder from './components/OneSignalBounder';
//import TechnicalSupportBounder from './components/TechnicalSupportBounder';
//import type { IInitialState } from './services/base/typing';
import './styles/global.less';
//import { currentRole } from './utils/ip';
import { AppInitialState } from '@/services/login/typing';

/** loading */
// //export const initialStateConfig = {
//     loading: <></>,
// };

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * // Tobe removed
 * */
export async function getInitialState(): Promise<AppInitialState> {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('userName');

  if (!token) {
    return { permissionLoading: false };
  }

  return {
    currentUser: { 
      name: name || 'User', 
      role: (role as 'ADMIN' | 'STUDENT') || 'STUDENT' 
    },
    permissionLoading: false,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    footerRender: () => <Footer />,
    
    rightContentRender: () => (
      <div style={{ display: 'flex', alignItems: 'center', paddingRight: '24px' }}>
        <LogoutOutlined 
          title="Đăng xuất" 
          style={{ 
            fontSize: '20px', 
            cursor: 'pointer',
            color: '#595959',
            padding: '8px',
            borderRadius: '50%',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#00b96b';
            e.currentTarget.style.backgroundColor = '#fff1f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#595959';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onClick={async () => {
            // Chuyển hướng an toàn nội bộ SPA trước
            history.replace('/login');
            
            // Dọn dẹp dữ liệu sạch sẽ
            localStorage.clear();
            sessionStorage.clear();
            setInitialState((s) => ({ ...s, currentUser: undefined }));
          }} 
        />
      </div>
    ),
    
    childrenRender: (dom) => <>{dom}</>, 
    
    onPageChange: () => {
      const { location } = history;
      const token = localStorage.getItem('token');
      
      // Nếu lộ trình đang di chuyển tới hoặc đang đứng ở login -> Thoát luôn, cấm check quyền
      if (location.pathname === '/login') {
        return;
      }

      // Nếu không có user trong RAM hệ thống và không có token ở localStorage -> Trục xuất về Login
      if (!initialState?.currentUser && !token) {
        history.replace('/login');
      }
    },
  };
};