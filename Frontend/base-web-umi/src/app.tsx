import { history, RunTimeLayoutConfig } from 'umi';
import { AppInitialState } from '@/services/login/typing';
import Footer from '@/components/Footer';
import { LogoutOutlined } from '@ant-design/icons';

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
    
    // 🎯 ĐÃ SỬA: Khai tử hoàn toàn component cũ, chỉ render duy nhất icon logout của bạn
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